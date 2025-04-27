package com.buzzsocial.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {
    @Size(max = 100, message = "Full name must be less than 100 characters")
    private String fullName;
    
    @Size(max = 1000, message = "Bio must be less than 1000 characters")
    private String bio;
    
    private String avatarUrl;
    private String bannerUrl;
    private String instagram;
    private String facebook;
    private String twitter;
    private String linkedin;
    private String website;
}
