package com.ecommerce.controller;

import com.ecommerce.dto.JwtResponse;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.SignupRequest;
import com.ecommerce.dto.ApiResponse;
import com.ecommerce.model.User;
import com.ecommerce.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        User user = authService.authenticateUser(loginRequest);
        String jwt = authService.generateToken(user);
        
        String role = user.getRoles().stream()
                .findFirst()
                .map(r -> r.getName())
                .orElse("");
        
        return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), role));
    }
    
    @PostMapping("/test")
    public ResponseEntity<?> testEndpoint(@RequestBody String rawBody) {
        System.out.println("Raw request body: " + rawBody);
        return ResponseEntity.ok("Received: " + rawBody);
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        try {
            System.out.println("=== REGISTRATION DEBUG START ===");
            System.out.println("Received signup request");
            System.out.println("Username: " + signUpRequest.getUsername());
            System.out.println("Email: " + signUpRequest.getEmail());
            System.out.println("Password: " + (signUpRequest.getPassword() != null ? "NOT_NULL" : "NULL"));
            System.out.println("Calling authService.registerUser...");
            authService.registerUser(signUpRequest);
            System.out.println("authService.registerUser completed successfully");
            System.out.println("=== REGISTRATION DEBUG END ===");
            return ResponseEntity.ok(new ApiResponse(true, "User registered successfully!"));
        } catch (RuntimeException e) {
            System.err.println("=== REGISTRATION ERROR ===");
            System.err.println("Registration failed: " + e.getMessage());
            e.printStackTrace();
            System.err.println("=== END ERROR ===");
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
