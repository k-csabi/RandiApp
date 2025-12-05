package hu.unideb.inf.randiapp.service;

import hu.unideb.inf.randiapp.service.dto.CompletedDateRequest;
import hu.unideb.inf.randiapp.service.dto.CompletedDateDto;
import hu.unideb.inf.randiapp.data.entity.CompletedDate;
import hu.unideb.inf.randiapp.data.entity.DateIdea;
import hu.unideb.inf.randiapp.data.entity.User;
import hu.unideb.inf.randiapp.data.repository.CompletedDateRepository;
import hu.unideb.inf.randiapp.data.repository.DateIdeaRepository;
import hu.unideb.inf.randiapp.data.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CompletedDateService {

    private final CompletedDateRepository completedDateRepository;
    private final DateIdeaRepository dateIdeaRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    public void logDate(CompletedDateRequest request) {
        User user = getCurrentUser();

        Optional<CompletedDate> existing = completedDateRepository.findByCoupleIdAndDateIdeaId(
                user.getCouple().getId(), request.getDateIdeaId()
        );

        if (existing.isPresent()) {
            CompletedDate completed = existing.get();

            if (!completed.getInitiator().getId().equals(user.getId())) {
                completed.setRatingUser2(request.getRating());


                if (request.getNote() != null && !request.getNote().isEmpty()) {
                    String oldNote = completed.getNote() == null ? "" : completed.getNote();
                    completed.setNote(oldNote + " | Partner: " + request.getNote());
                }
                completedDateRepository.save(completed);
            }
        } else {
            DateIdea dateIdea = dateIdeaRepository.findById(request.getDateIdeaId())
                    .orElseThrow(() -> new RuntimeException("Randi nem található"));

            CompletedDate completed = new CompletedDate();
            completed.setCouple(user.getCouple());
            completed.setDateIdea(dateIdea);
            completed.setCompletedAt(LocalDateTime.now());
            completed.setInitiator(user);
            completed.setRatingUser1(request.getRating());
            completed.setNote(request.getNote());

            completedDateRepository.save(completed);
        }

    }

    public List<CompletedDateDto> getHistory() {
        User currentUser = getCurrentUser();
        List<CompletedDate> entities = completedDateRepository.findByCoupleIdOrderByCompletedAtDesc(
                currentUser.getCouple().getId()
        );

        return entities.stream().map(c -> {
            String partnerName = "Partner";
            for (User u : c.getCouple().getPartners()) {
                if (!u.getId().equals(c.getInitiator().getId())) {
                    partnerName = u.getName();
                    break;
                }
            }

            return new CompletedDateDto(
                    c.getId(),
                    c.getDateIdea() != null ? c.getDateIdea().getTitle() : "Törölt randi",
                    c.getCompletedAt(),
                    c.getInitiator().getName(),
                    c.getRatingUser1(),
                    partnerName,
                    c.getRatingUser2(),
                    c.getNote(),
                    c.getDateIdea() != null ? c.getDateIdea().getId() : 0L
            );
        }).toList();
    }

    public void updateLog(Long id, CompletedDateRequest request) {
        User user = getCurrentUser();
        CompletedDate log = completedDateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nem található"));

        String fullNote = log.getNote() == null ? "" : log.getNote();
        String[] parts = fullNote.split(" \\| Partner: ");
        String note1 = parts.length > 0 ? parts[0] : "";
        String note2 = parts.length > 1 ? parts[1] : "";

        if (log.getInitiator().getId().equals(user.getId())) {
            log.setRatingUser1(request.getRating());
            log.setNote(request.getNote() + " | Partner: " + note2);
        } else {
            log.setRatingUser2(request.getRating());
            log.setNote(note1 + " | Partner: " + request.getNote());
        }
        completedDateRepository.save(log);
    }
}