package com.ecommerce.service;

import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;

@Service
public class ProfileService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User getUserProfile(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
    
    public User updateUserProfile(String username, Map<String, Object> profileData) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return null;
        }
        
        // Update profile fields
        if (profileData.containsKey("firstName")) {
            user.setFirstName((String) profileData.get("firstName"));
        }
        if (profileData.containsKey("lastName")) {
            user.setLastName((String) profileData.get("lastName"));
        }
        if (profileData.containsKey("phone")) {
            user.setPhone((String) profileData.get("phone"));
        }
        if (profileData.containsKey("address")) {
            user.setAddress((String) profileData.get("address"));
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    public String uploadProfilePicture(String username, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }
        
        // Convert file to Base64
        byte[] bytes = file.getBytes();
        String base64Image = Base64.getEncoder().encodeToString(bytes);
        
        // Get file extension for MIME type
        String originalFilename = file.getOriginalFilename();
        String contentType = file.getContentType();
        if (originalFilename == null) {
            throw new IllegalArgumentException("Original filename cannot be null");
        }
        
        // Create data URI format
        String dataUri = "data:" + contentType + ";base64," + base64Image;
        
        // Update user profile with base64 image
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null) {
            user.setProfilePicture(dataUri);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        }
        
        return dataUri;
    }
}
