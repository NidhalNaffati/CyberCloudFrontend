package com.buzzsocial.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "Administration API")
public class AdminController {
    // This controller has been deprecated in favor of AdminDashboardController
    // Keeping the class for backward compatibility but with no endpoints
}
