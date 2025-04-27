package com.buzzsocial.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReportBuzzRequest {
    @NotBlank(message = "Reason is required")
    private String reason;
}
