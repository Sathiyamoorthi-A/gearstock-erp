package com.gearstock.controller;

import com.gearstock.model.User;
import com.gearstock.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private boolean isAuthorized() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return false;
        String role = auth.getAuthorities().iterator().next().getAuthority();
        return "ROLE_ADMIN".equals(role) || "ROLE_WAREHOUSE_MGR".equals(role);
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        if (!isAuthorized()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only Admins and Managers can manage users.");
        }
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/{id}/permissions")
    public ResponseEntity<?> updateUserPermissions(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload
    ) {
        if (!isAuthorized()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only Admins and Managers can alter employee permissions.");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (payload.containsKey("allowedModules")) {
            user.setAllowedModules((String) payload.get("allowedModules"));
        }
        if (payload.containsKey("department")) {
            user.setDepartment((String) payload.get("department"));
        }

        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }
}
