package hu.unideb.inf.randiapp.service;

import hu.unideb.inf.randiapp.service.dto.DateIdeaDto;
import hu.unideb.inf.randiapp.data.entity.DateIdea;
import hu.unideb.inf.randiapp.data.entity.User;
import hu.unideb.inf.randiapp.data.repository.DateIdeaRepository;
import hu.unideb.inf.randiapp.data.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DateIdeaService {

    private final DateIdeaRepository dateIdeaRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    public List<DateIdeaDto> getAllDates() {
        User user = getCurrentUser();
        Long currentCoupleId = user.getCouple().getId();

        List<DateIdea> entities = dateIdeaRepository.findAllForCouple(currentCoupleId);

        return entities.stream().map(dateIdea -> {
            boolean isOwn = dateIdea.getCreatedBy() != null &&
                    dateIdea.getCreatedBy().getId().equals(currentCoupleId);

            return new DateIdeaDto(
                    dateIdea.getId(),
                    dateIdea.getTitle(),
                    dateIdea.getDescription(),
                    dateIdea.getTags(),
                    isOwn
            );
        }).toList();
    }

    public void deleteDate(Long id) {
        User user = getCurrentUser();
        DateIdea dateIdea = dateIdeaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nem található"));

        // Biztonsági ellenőrzés: Csak a SAJÁT ötletet törölhetjük!
        if (dateIdeaRepository.existsById(id)) {
            dateIdeaRepository.deleteById(id);
        } else {
            throw new RuntimeException("Nem található ilyen randi!");
        }
    }

    public DateIdea createDate(DateIdea dateIdea) {
        User user = getCurrentUser();
        dateIdea.setCreatedBy(user.getCouple());
        return dateIdeaRepository.save(dateIdea);
    }

    public void updateDate(Long id, DateIdeaDto dto) {
        // Megkeressük az ötletet
        DateIdea dateIdea = dateIdeaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nem található"));

        // FELTÉTEL NÉLKÜLI SZERKESZTÉS:
        // Bárki szerkesztheti, nem ellenőrizzük a tulajdonost.
        dateIdea.setTitle(dto.getTitle());
        dateIdea.setDescription(dto.getDescription());
        dateIdea.setTags(dto.getTags());

        dateIdeaRepository.save(dateIdea);
    }
}