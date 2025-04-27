package com.buzzsocial.controller;

import com.buzzsocial.dto.response.BuzzDto;
import com.buzzsocial.dto.response.UserDto;
import com.buzzsocial.service.BuzzService;
import com.buzzsocial.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/explore")
@Tag(name = "Explore", description = "Explore and search API")
public class ExploreController {

    @Autowired
    private BuzzService buzzService;

    @Autowired
    private UserService userService;

    @GetMapping("/buzzs")
    @Operation(summary = "Search buzzs", description = "Searches for buzz posts by query")
    public ResponseEntity<List<BuzzDto>> searchBuzzs(
            @RequestParam String query,
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(buzzService.searchBuzzs(query, userId, page, size));
    }

    @GetMapping("/people")
    @Operation(summary = "Search users", description = "Searches for users by query")
    public ResponseEntity<List<UserDto>> searchUsers(
            @RequestParam String query,
            HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(userService.searchUsers(query, userId));
    }
}
