package hu.unideb.inf.randiapp.controller;

import hu.unideb.inf.randiapp.service.dto.AuthResponse;
import hu.unideb.inf.randiapp.service.dto.LoginRequest;
import hu.unideb.inf.randiapp.service.dto.RegisterRequest;
import hu.unideb.inf.randiapp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}


