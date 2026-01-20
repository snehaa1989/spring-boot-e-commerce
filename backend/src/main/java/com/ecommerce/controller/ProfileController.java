package com.ecommerce.controller;

import com.ecommerce.model.User;
import com.ecommerce.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000", "http://127.0.0.1:4200", "http://127.0.0.1:3000"})
public class ProfileController {
    
    @Autowired
    private ProfileService profileService;
    
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = profileService.getUserProfile(username);
        if (user != null) {
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getId());
            profile.put("username", user.getUsername());
            profile.put("email", user.getEmail());
            profile.put("firstName", user.getFirstName());
            profile.put("lastName", user.getLastName());
            profile.put("phone", user.getPhone());
            profile.put("address", user.getAddress());
            profile.put("profilePicture", user.getProfilePicture());
            profile.put("createdAt", user.getCreatedAt());
            profile.put("updatedAt", user.getUpdatedAt());
            
            return ResponseEntity.ok(profile);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> profileData) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User updatedUser = profileService.updateUserProfile(username, profileData);
        if (updatedUser != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedUser.getId());
            response.put("username", updatedUser.getUsername());
            response.put("email", updatedUser.getEmail());
            response.put("firstName", updatedUser.getFirstName());
            response.put("lastName", updatedUser.getLastName());
            response.put("phone", updatedUser.getPhone());
            response.put("address", updatedUser.getAddress());
            response.put("profilePicture", updatedUser.getProfilePicture());
            response.put("createdAt", updatedUser.getCreatedAt());
            response.put("updatedAt", updatedUser.getUpdatedAt());
            
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/picture")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload");
        }
        
        try {
            String profilePictureUrl = profileService.uploadProfilePicture(username, file);
            Map<String, String> response = new HashMap<>();
            response.put("profilePicture", profilePictureUrl);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to upload profile picture: " + e.getMessage());
        }
    }
}
