package hu.unideb.inf.randiapp.service;

import hu.unideb.inf.randiapp.service.dto.AuthResponse;
import hu.unideb.inf.randiapp.service.dto.LoginRequest;
import hu.unideb.inf.randiapp.service.dto.RegisterRequest;
import hu.unideb.inf.randiapp.data.entity.Couple;
import hu.unideb.inf.randiapp.data.entity.User;
import hu.unideb.inf.randiapp.data.repository.CoupleRepository;
import hu.unideb.inf.randiapp.data.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CoupleRepository coupleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Couple couple;
        if (request.getInviteCode() != null && !request.getInviteCode().isEmpty()) {
            couple = coupleRepository.findByInviteCode(request.getInviteCode())
                    .orElseThrow(() -> new RuntimeException("Invalid invite code"));
        } else {
            couple = new Couple();
            couple.setInviteCode(UUID.randomUUID().toString().substring(0, 6).toUpperCase());
            coupleRepository.save(couple);
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCouple(couple);

        String jwtToken = jwtService.generateToken(user);

        user.setCurrentToken(jwtToken);
        userRepository.save(user);

        return new AuthResponse(jwtToken, user.getName(), couple.getInviteCode());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);

        user.setCurrentToken(jwtToken);
        userRepository.save(user);

        return new AuthResponse(jwtToken, user.getName(), user.getCouple().getInviteCode());
    }
}