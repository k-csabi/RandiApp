package hu.unideb.inf.randiapp.controller;

import hu.unideb.inf.randiapp.service.dto.UpdateProfileRequest;
import hu.unideb.inf.randiapp.service.dto.UserDto;
import hu.unideb.inf.randiapp.data.entity.Couple;
import hu.unideb.inf.randiapp.data.entity.User;
import hu.unideb.inf.randiapp.data.repository.CompletedDateRepository;
import hu.unideb.inf.randiapp.data.repository.CoupleRepository;
import hu.unideb.inf.randiapp.data.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final CoupleRepository coupleRepository;
    private final CompletedDateRepository completedDateRepository;

    @GetMapping("/me")
    public UserDto getMyProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User me = userRepository.findByEmail(email).orElseThrow();
        Couple couple = me.getCouple();

        String partnerName = "Még nincs párod :(";
        String partnerAvatar = null;
        if (couple != null && couple.getPartners() != null) {
            for (User u : couple.getPartners()) {
                if (!u.getId().equals(me.getId())) {
                    partnerName = u.getName();
                    partnerAvatar = u.getAvatar();
                    break;
                }
            }
        }

        int stats = 0;
        if (couple != null) {
            stats = completedDateRepository.findByCoupleIdOrderByCompletedAtDesc(couple.getId()).size();
        }

        String relationShipStartStr = null;
        if (couple != null && couple.getRelationshipStart() != null) {
            relationShipStartStr = couple.getRelationshipStart().toString();
        }

        return new UserDto(
                me.getId(),
                me.getName(),
                me.getEmail(),
                couple != null ? couple.getInviteCode() : "",
                partnerName,
                stats,
                me.getAvatar(),
                partnerAvatar,
                relationShipStartStr
        );
    }

    
    @PutMapping("/update")
    public void updateProfile(@RequestBody UpdateProfileRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User me = userRepository.findByEmail(email).orElseThrow();
        Couple couple = me.getCouple();

        
        if (request.getAvatar() != null) {
            me.setAvatar(request.getAvatar());
            userRepository.save(me);
        }

        
        if (request.getRelationshipStart() != null && !request.getRelationshipStart().isEmpty() && couple != null) {
            try {
                couple.setRelationshipStart(LocalDate.parse(request.getRelationshipStart()));
                coupleRepository.save(couple);
            } catch (Exception e) {
                System.err.println("Hibás dátum formátum: " + request.getRelationshipStart());
            }
        }
    }
}



