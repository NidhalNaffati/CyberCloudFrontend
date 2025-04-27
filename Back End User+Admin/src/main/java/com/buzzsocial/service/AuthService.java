package com.buzzsocial.service;

import com.buzzsocial.config.JwtConfig;
import com.buzzsocial.dto.request.LoginRequest;
import com.buzzsocial.dto.request.RegisterRequest;
import com.buzzsocial.dto.response.AuthResponse;
import com.buzzsocial.dto.response.UserDto;
import com.buzzsocial.exception.BadRequestException;
import com.buzzsocial.exception.UnauthorizedException;
import com.buzzsocial.model.User;
import com.buzzsocial.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtConfig jwtConfig;

    public AuthResponse register(RegisterRequest request) {
        // Validate username and email uniqueness
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Validate age if birthdate is provided
        if (request.getBirthDate() != null) {
            int age = Period.between(request.getBirthDate(), LocalDate.now()).getYears();
            if (age < 13) {
                throw new BadRequestException("You must be at least 13 years old to register");
            }
        }

        // Create new user
        User user = new User();
        user.setFullName(request.getFullName());
        user.setBirthDate(request.getBirthDate());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); // Note: In a real app, you would hash this
        user.setIsAdmin(false);

        user = userRepository.save(user);

        // Generate JWT token
        String token = jwtConfig.generateToken(user.getUsername());

        // Create response
        return AuthResponse.builder()
                .accessToken(token)
                .user(mapToUserDto(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // Find user by username or email
        Optional<User> userOptional;
        if (request.getUsernameOrEmail().contains("@")) {
            userOptional = userRepository.findByEmail(request.getUsernameOrEmail());
        } else {
            userOptional = userRepository.findByUsername(request.getUsernameOrEmail());
        }

        // Validate user exists
        User user = userOptional.orElseThrow(() -> 
            new UnauthorizedException("Invalid username/email or password"));

        // Check if user is banned - PREVENT LOGIN IF BANNED
        if (user.getIsBanned()) {
            throw new UnauthorizedException("Your account has been banned. Please contact support for assistance.");
        }

        // Validate password
        if (!user.getPassword().equals(request.getPassword())) {
            throw new UnauthorizedException("Invalid username/email or password");
        }

        // Generate JWT token
        String token = jwtConfig.generateToken(user.getUsername());

        // Create response
        return AuthResponse.builder()
                .accessToken(token)
                .user(UserDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .isBanned(user.getIsBanned())
                        .isAdmin(user.getIsAdmin())
                        .build())
                .build();
    }

    public UserDto getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
        
        return mapToUserDto(user);
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .bannerUrl(user.getBannerUrl())
                .bio(user.getBio())
                .instagram(user.getInstagram())
                .facebook(user.getFacebook())
                .twitter(user.getTwitter())
                .linkedin(user.getLinkedin())
                .website(user.getWebsite())
                .followersCount(user.getFollowersCount())
                .followingsCount(user.getFollowingsCount())
                .buzzCount(user.getBuzzCount())
                .isBanned(user.getIsBanned())
                .isAdmin(user.getIsAdmin())
                .joinedAt(user.getCreatedAt())
                .build();
    }
}
