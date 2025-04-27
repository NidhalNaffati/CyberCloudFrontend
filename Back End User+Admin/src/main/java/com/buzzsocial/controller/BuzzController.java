package com.buzzsocial.controller;

import com.buzzsocial.dto.request.CreateBuzzRequest;
import com.buzzsocial.dto.request.CreateCommentRequest;
import com.buzzsocial.dto.request.ReportBuzzRequest;
import com.buzzsocial.dto.response.BuzzDto;
import com.buzzsocial.dto.response.CommentDto;
import com.buzzsocial.dto.response.TrendDto;
import com.buzzsocial.service.BuzzService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buzzs")
@Tag(name = "Buzzs", description = "Buzz management API")
public class BuzzController {

    @Autowired
    private BuzzService buzzService;

    @PostMapping
    @Operation(summary = "Create buzz", description = "Creates a new buzz post")
    public ResponseEntity<BuzzDto> createBuzz(
            HttpServletRequest request,
            @Valid @RequestBody CreateBuzzRequest createRequest) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(buzzService.createBuzz(userId, createRequest));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete buzz", description = "Deletes a buzz post by ID")
    public ResponseEntity<Void> deleteBuzz(
            @PathVariable String id,
            HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        buzzService.deleteBuzz(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get buzz", description = "Returns a buzz post by ID")
    public ResponseEntity<BuzzDto> getBuzz(
            @PathVariable String id,
            HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(buzzService.getBuzzById(id, userId));
    }

    @GetMapping("/mainstream")
    @Operation(summary = "Get mainstream buzzs", description = "Returns a list of mainstream buzz posts")
    public ResponseEntity<List<BuzzDto>> getMainstreamBuzzs(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(buzzService.getMainstreamBuzzs(userId, page, size));
    }

    @GetMapping("/followings")
    @Operation(summary = "Get followings buzzs", description = "Returns buzz posts from users the current user follows")
    public ResponseEntity<List<BuzzDto>> getFollowingsBuzzs(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(buzzService.getFollowingsBuzzs(userId, page, size));
    }

    @GetMapping("/explore")
    @Operation(summary = "Get popular buzzs", description = "Returns popular buzz posts")
    public ResponseEntity<List<BuzzDto>> getPopularBuzzs(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(buzzService.getPopularBuzzs(userId, page, size));
    }

    @GetMapping("/unpopular")
    @Operation(summary = "Get unpopular buzzs", description = "Returns unpopular buzz posts")
    public ResponseEntity<List<BuzzDto>> getUnpopularBuzzs(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(buzzService.getUnpopularBuzzs(userId, page, size));
    }

    @GetMapping("/trends")
    @Operation(summary = "Get trending buzzs", description = "Returns trending buzz posts")
    public ResponseEntity<List<TrendDto>> getTrendingBuzzs() {
        return ResponseEntity.ok(buzzService.getTrendingBuzzs());
    }

    @GetMapping("/bookmarks")
    @Operation(summary = "Get bookmarked buzzs", description = "Returns buzz posts bookmarked by the current user")
    public ResponseEntity<List<BuzzDto>> getBookmarkedBuzzs(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(buzzService.getBookmarkedBuzzs(userId, page, size));
    }

    @GetMapping("/bookmarks/user/{userId}")
    @Operation(summary = "Get bookmarked buzzs by user ID", description = "Returns buzz posts bookmarked by a specific user")
    public ResponseEntity<List<BuzzDto>> getBookmarkedBuzzsByUserId(
            @PathVariable String userId,
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String currentUserId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(buzzService.getBookmarkedBuzzsByUserId(userId, currentUserId, page, size));
    }

    @PostMapping("/{id}/like")
    @Operation(summary = "Like buzz", description = "Likes a buzz post")
    public ResponseEntity<Void> likeBuzz(
            @PathVariable String id,
            HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        buzzService.likeBuzz(id, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/unlike")
    @Operation(summary = "Unlike buzz", description = "Unlikes a buzz post")
    public ResponseEntity<Void> unlikeBuzz(
            @PathVariable String id,
            HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        buzzService.unlikeBuzz(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/bookmark")
    @Operation(summary = "Bookmark buzz", description = "Bookmarks a buzz post")
    public ResponseEntity<Void> bookmarkBuzz(
            @PathVariable String id,
            HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        buzzService.bookmarkBuzz(id, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/unbookmark")
    @Operation(summary = "Unbookmark buzz", description = "Removes a bookmark from a buzz post")
    public ResponseEntity<Void> unbookmarkBuzz(
            @PathVariable String id,
            HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        buzzService.unbookmarkBuzz(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/report")
    @Operation(summary = "Report buzz", description = "Reports a buzz post")
    public ResponseEntity<Void> reportBuzz(
            @PathVariable String id,
            HttpServletRequest request,
            @Valid @RequestBody ReportBuzzRequest reportRequest) {
        String userId = (String) request.getAttribute("userId");
        buzzService.reportBuzz(id, userId, reportRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/comments")
    @Operation(summary = "Create comment", description = "Creates a comment on a buzz post")
    public ResponseEntity<CommentDto> createComment(
            @PathVariable String id,
            HttpServletRequest request,
            @Valid @RequestBody CreateCommentRequest commentRequest) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(buzzService.createComment(id, userId, commentRequest));
    }

    @GetMapping("/{id}/comments")
    @Operation(summary = "Get buzz comments", description = "Returns comments for a buzz post")
    public ResponseEntity<List<CommentDto>> getBuzzComments(
            @PathVariable String id,
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(buzzService.getBuzzComments(id, userId, page, size));
    }

    @PostMapping("/comments/{id}/like")
    @Operation(summary = "Like comment", description = "Likes a comment")
    public ResponseEntity<Void> likeComment(
            @PathVariable String id,
            HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        buzzService.likeComment(id, userId, true);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/comments/{id}/dislike")
    @Operation(summary = "Dislike comment", description = "Dislikes a comment")
    public ResponseEntity<Void> dislikeComment(
            @PathVariable String id,
            HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        buzzService.likeComment(id, userId, false);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/comments/{id}/unlike")
    @Operation(summary = "Unlike comment", description = "Removes a like or dislike from a comment")
    public ResponseEntity<Void> unlikeComment(
            @PathVariable String id,
            HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        buzzService.unlikeComment(id, userId);
        return ResponseEntity.ok().build();
    }
}
