package com.buzzsocial.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateBuzzRequest {
    @Size(max = 70, message = "Title must be less than 70 characters")
    private String title;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    private String mediaUrl;
}
