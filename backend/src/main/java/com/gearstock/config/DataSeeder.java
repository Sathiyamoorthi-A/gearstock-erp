package com.gearstock.config;

import com.gearstock.model.*;
import com.gearstock.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * DataSeeder — runs once on startup.
 * Only creates the default admin account if NO users exist yet.
 * All other data (inventory, orders, customers, etc.) must be entered
 * through the application by real users.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        createDefaultAdminIfMissing();
    }

    /**
     * Creates the first admin user only if the users table is completely empty.
     * After first login, the admin should change the password via Settings.
     */
    private void createDefaultAdminIfMissing() {
        if (userRepository.count() > 0) {
            log.info("Users already exist — skipping default admin creation.");
            return;
        }

        User admin = User.builder()
                .username("admin")
                .email("admin@gearstock.com")
                .password(passwordEncoder.encode("admin123"))
                .fullName("System Administrator")
                .role(Role.ROLE_ADMIN)
                .department("Management")
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(admin);
        log.info("============================================================");
        log.info("  Default admin account created.");
        log.info("  Username : admin");
        log.info("  Password : admin123");
        log.info("  !! Change this password immediately after first login !!");
        log.info("============================================================");
    }
}
