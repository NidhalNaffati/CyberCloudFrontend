package com.buzzsocial.controller;

import com.buzzsocial.dto.request.UpdateUserRequest;
import com.buzzsocial.dto.response.UserDto;
import com.buzzsocial.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User management API")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get my profile", description = "Returns the current user's profile information")
    public ResponseEntity<UserDto> getMyProfile(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        String username = (String) request.getAttribute("username");
        return ResponseEntity.ok(userService.getUserProfile(username, userId));
    }

    @PutMapping("/me")
    @Operation(summary = "Update my profile", description = "Updates the current user's profile information")
    public ResponseEntity<UserDto> updateMyProfile(
            HttpServletRequest request,
            @Valid @RequestBody UpdateUserRequest updateRequest) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(userService.updateUserProfile(userId, updateRequest));
    }

    @GetMapping("/{username}")
    @Operation(summary = "Get user profile", description = "Returns a user's public profile information")
    public ResponseEntity<UserDto> getUserProfile(
            @PathVariable String username,
            HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(userService.getUserProfile(username, currentUserId));
    }

    @PostMapping("/{id}/follow")
    @Operation(summary = "Follow user", description = "Follow a user by their ID")
    public ResponseEntity<Void> followUser(
            @PathVariable String id,
            HttpServletRequest request) {
        String followerId = (String) request.getAttribute("userId");
        userService.followUser(followerId, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/unfollow")
    @Operation(summary = "Unfollow user", description = "Unfollow a user by their ID")
    public ResponseEntity<Void> unfollowUser(
            @PathVariable String id,
            HttpServletRequest request) {
        String followerId = (String) request.getAttribute("userId");
        userService.unfollowUser(followerId, id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/followers")
    @Operation(summary = "Get user followers by ID", description = "Returns a list of users who follow the specified user")
    public ResponseEntity<List<UserDto>> getUserFollowersById(
            @PathVariable String id,
            HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(userService.getUserFollowers(id, currentUserId));
    }

    @GetMapping("/{id}/followings")
    @Operation(summary = "Get user followings by ID", description = "Returns a list of users that the specified user follows")
    public ResponseEntity<List<UserDto>> getUserFollowingsById(
            @PathVariable String id,
            HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(userService.getUserFollowings(id, currentUserId));
    }

    @GetMapping("/by-username/{username}/followers")
    @Operation(summary = "Get user followers by username", description = "Returns a list of users who follow the specified user by username")
    public ResponseEntity<List<UserDto>> getUserFollowersByUsername(
            @PathVariable String username,
            HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(userService.getUserFollowersByUsername(username, currentUserId));
    }

    @GetMapping("/by-username/{username}/followings")
    @Operation(summary = "Get user followings by username", description = "Returns a list of users that the specified user follows by username")
    public ResponseEntity<List<UserDto>> getUserFollowingsByUsername(
            @PathVariable String username,
            HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(userService.getUserFollowingsByUsername(username, currentUserId));
    }

    @GetMapping("/by-email/{email}/followers")
    @Operation(summary = "Get user followers by email", description = "Returns a list of users who follow the specified user by email")
    public ResponseEntity<List<UserDto>> getUserFollowersByEmail(
            @PathVariable String email,
            HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(userService.getUserFollowersByEmail(email, currentUserId));
    }

    @GetMapping("/by-email/{email}/followings")
    @Operation(summary = "Get user followings by email", description = "Returns a list of users that the specified user follows by email")
    public ResponseEntity<List<UserDto>> getUserFollowingsByEmail(
            @PathVariable String email,
            HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(userService.getUserFollowingsByEmail(email, currentUserId));
    }

    @GetMapping("/me/followers")
    @Operation(summary = "Get my followers", description = "Returns a list of users who follow the current user")
    public ResponseEntity<List<UserDto>> getMyFollowers(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(userService.getUserFollowers(userId, userId));
    }

    @GetMapping("/me/followings")
    @Operation(summary = "Get my followings", description = "Returns a list of users that the current user follows")
    public ResponseEntity<List<UserDto>> getMyFollowings(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(userService.getUserFollowings(userId, userId));
    }

    @GetMapping("/discover")
    @Operation(summary = "Discover users", description = "Returns a list of random users for discovery")
    public ResponseEntity<List<UserDto>> discoverUsers(
            HttpServletRequest request,
            @RequestParam(defaultValue = "10") int limit) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(userService.discoverUsers(userId, limit));
    }
}
