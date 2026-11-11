package com.gym;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.gym.model.User;
import com.gym.repository.UserRepository;

@Configuration
public class AdminSetup {

    @Bean
    public CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (!userRepository.existsByUsername("admin@gmail.com")) {

                User admin = new User();

                admin.setUsername("admin@gmail.com");

                admin.setPassword(
                    passwordEncoder.encode("Admin@123")
                );

                admin.setRole("ADMIN");

                admin.setEnabled(true);

                userRepository.save(admin);

                System.out.println("Admin account created successfully!");

            } else {

                System.out.println("Admin account already exists!");

            }
        };
    }
}