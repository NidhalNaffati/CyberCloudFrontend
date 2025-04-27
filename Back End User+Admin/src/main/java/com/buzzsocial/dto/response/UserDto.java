package com.buzzsocial.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String id;
    private String username;
    private String email;
    private String fullName;
    private LocalDate birthDate;
    private String avatarUrl;
    private String bannerUrl;
    private String bio;
    private String instagram;
    private String facebook;
    private String twitter;
    private String linkedin;
    private String website;
    private Integer followersCount;
    private Integer followingsCount;
    private Integer buzzCount;
    private Boolean isBanned;
    private Boolean isAdmin;
    private LocalDateTime joinedAt;
    private Boolean isFollowed;
}
