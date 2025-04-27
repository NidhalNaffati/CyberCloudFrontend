package com.buzzsocial.controller;

import com.buzzsocial.dto.request.CreateAdminRequest;
import com.buzzsocial.dto.response.UserDto;
import com.buzzsocial.model.Buzz;
import com.buzzsocial.model.BuzzComment;
import com.buzzsocial.model.BuzzReport;
import com.buzzsocial.model.User;
import com.buzzsocial.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@Tag(name = "Admin Dashboard", description = "Admin dashboard API")
public class AdminDashboardController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/register")
    @Operation(summary = "Register admin", description = "Creates a new admin account")
    public ResponseEntity<User> registerAdmin(@Valid @RequestBody CreateAdminRequest request) {
        return ResponseEntity.ok(adminService.createAdmin(request));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard stats", description = "Returns statistics for the admin dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "DAY") String groupBy) {
        return ResponseEntity.ok(adminService.getDashboardStats(startDate, endDate, groupBy));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users", description = "Returns a paginated list of all users")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        return ResponseEntity.ok(adminService.getAllUsers(page, size, sortBy, direction));
    }

    @GetMapping("/users/banned")
    @Operation(summary = "Get all banned users", description = "Returns a list of all banned users")
    public ResponseEntity<List<User>> getAllBannedUsers() {
        return ResponseEntity.ok(adminService.getAllBannedUsers());
    }

    @GetMapping("/users/search")
    @Operation(summary = "Search users", description = "Searches for users by query")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(adminService.searchUsers(query));
    }

    @GetMapping("/buzzs")
    @Operation(summary = "Get all buzzs", description = "Returns a paginated list of all buzz posts")
    public ResponseEntity<Page<Buzz>> getAllBuzzs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        return ResponseEntity.ok(adminService.getAllBuzzs(page, size, sortBy, direction));
    }

    @GetMapping("/buzzs/search")
    @Operation(summary = "Search buzzs", description = "Searches for buzz posts by query")
    public ResponseEntity<List<Buzz>> searchBuzzs(@RequestParam String query) {
        return ResponseEntity.ok(adminService.searchBuzzs(query));
    }

    @DeleteMapping("/buzzs/{id}")
    @Operation(summary = "Delete buzz", description = "Deletes a buzz post by ID")
    public ResponseEntity<Void> deleteBuzz(@PathVariable String id) {
        adminService.deleteBuzz(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/comments")
    @Operation(summary = "Get all comments", description = "Returns a paginated list of all comments")
    public ResponseEntity<Page<BuzzComment>> getAllComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        return ResponseEntity.ok(adminService.getAllComments(page, size, sortBy, direction));
    }

    @GetMapping("/comments/search")
    @Operation(summary = "Search comments", description = "Searches for comments by query")
    public ResponseEntity<List<BuzzComment>> searchComments(@RequestParam String query) {
        return ResponseEntity.ok(adminService.searchComments(query));
    }

    @DeleteMapping("/comments/{id}")
    @Operation(summary = "Delete comment", description = "Deletes a comment by ID")
    public ResponseEntity<Void> deleteComment(@PathVariable String id) {
        adminService.deleteComment(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/ban/user/by-username/{username}")
    @Operation(summary = "Ban user by username", description = "Bans a user by their username")
    public ResponseEntity<Void> banUserByUsername(@PathVariable String username) {
        adminService.banUserByUsername(username);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/ban/user/by-email/{email}")
    @Operation(summary = "Ban user by email", description = "Bans a user by their email")
    public ResponseEntity<Void> banUserByEmail(@PathVariable String email) {
        adminService.banUserByEmail(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unban/user/by-username/{username}")
    @Operation(summary = "Unban user by username", description = "Unbans a user by their username")
    public ResponseEntity<Void> unbanUserByUsername(@PathVariable String username) {
        adminService.unbanUserByUsername(username);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unban/user/by-email/{email}")
    @Operation(summary = "Unban user by email", description = "Unbans a user by their email")
    public ResponseEntity<Void> unbanUserByEmail(@PathVariable String email) {
        adminService.unbanUserByEmail(email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/{id}/followers")
    @Operation(summary = "Get user followers by ID", description = "Returns a list of followers for a user by ID")
    public ResponseEntity<List<UserDto>> getUserFollowersById(@PathVariable String id) {
        return ResponseEntity.ok(adminService.getUserFollowers(id));
    }

    @GetMapping("/users/{id}/followings")
    @Operation(summary = "Get user followings by ID", description = "Returns a list of users that a user follows by ID")
    public ResponseEntity<List<UserDto>> getUserFollowingsById(@PathVariable String id) {
        return ResponseEntity.ok(adminService.getUserFollowings(id));
    }

    @GetMapping("/users/by-username/{username}/followers")
    @Operation(summary = "Get user followers by username", description = "Returns a list of followers for a user by username")
    public ResponseEntity<List<UserDto>> getUserFollowersByUsername(@PathVariable String username) {
        return ResponseEntity.ok(adminService.getUserFollowersByUsername(username));
    }

    @GetMapping("/users/by-username/{username}/followings")
    @Operation(summary = "Get user followings by username", description = "Returns a list of users that a user follows by username")
    public ResponseEntity<List<UserDto>> getUserFollowingsByUsername(@PathVariable String username) {
        return ResponseEntity.ok(adminService.getUserFollowingsByUsername(username));
    }

    @GetMapping("/users/by-email/{email}/followers")
    @Operation(summary = "Get user followers by email", description = "Returns a list of followers for a user by email")
    public ResponseEntity<List<UserDto>> getUserFollowersByEmail(@PathVariable String email) {
        return ResponseEntity.ok(adminService.getUserFollowersByEmail(email));
    }

    @GetMapping("/users/by-email/{email}/followings")
    @Operation(summary = "Get user followings by email", description = "Returns a list of users that a user follows by email")
    public ResponseEntity<List<UserDto>> getUserFollowingsByEmail(@PathVariable String email) {
        return ResponseEntity.ok(adminService.getUserFollowingsByEmail(email));
    }
}
