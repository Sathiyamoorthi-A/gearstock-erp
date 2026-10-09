package com.gearstock.controller;

import com.gearstock.dto.LoginRequest;
import com.gearstock.dto.LoginResponse;
import com.gearstock.dto.RegisterRequest;
import com.gearstock.model.User;
import com.gearstock.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterRequest request) {
        LoginResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal User user) {
        Map<String, Object> userInfo = Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "fullName", user.getFullName() != null ? user.getFullName() : "",
                "email", user.getEmail() != null ? user.getEmail() : "",
                "role", user.getRole().name(),
                "department", user.getDepartment() != null ? user.getDepartment() : "",
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "allowedModules", user.getAllowedModules() != null ? user.getAllowedModules() : ""
        );
        return ResponseEntity.ok(userInfo);
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> payload
    ) {
        if (payload.containsKey("fullName")) {
            user.setFullName(payload.get("fullName"));
        }
        if (payload.containsKey("email")) {
            user.setEmail(payload.get("email"));
        }
        if (payload.containsKey("department")) {
            user.setDepartment(payload.get("department"));
        }
        if (payload.containsKey("phone")) {
            user.setPhone(payload.get("phone"));
        }

        User updatedUser = authService.updateProfile(user);

        Map<String, Object> userInfo = Map.of(
                "id", updatedUser.getId(),
                "username", updatedUser.getUsername(),
                "fullName", updatedUser.getFullName() != null ? updatedUser.getFullName() : "",
                "email", updatedUser.getEmail() != null ? updatedUser.getEmail() : "",
                "role", updatedUser.getRole().name(),
                "department", updatedUser.getDepartment() != null ? updatedUser.getDepartment() : "",
                "phone", updatedUser.getPhone() != null ? updatedUser.getPhone() : "",
                "allowedModules", updatedUser.getAllowedModules() != null ? updatedUser.getAllowedModules() : ""
        );
        return ResponseEntity.ok(userInfo);
    }
}
