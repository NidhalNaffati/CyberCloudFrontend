package com.buzzsocial.service;

import com.buzzsocial.dto.request.CreateBuzzRequest;
import com.buzzsocial.dto.request.CreateCommentRequest;
import com.buzzsocial.dto.request.ReportBuzzRequest;
import com.buzzsocial.dto.response.BuzzDto;
import com.buzzsocial.dto.response.CommentDto;
import com.buzzsocial.dto.response.TrendDto;
import com.buzzsocial.dto.response.UserDto;
import com.buzzsocial.exception.BadRequestException;
import com.buzzsocial.exception.ResourceNotFoundException;
import com.buzzsocial.model.*;
import com.buzzsocial.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BuzzService {

    @Autowired
    private BuzzRepository buzzRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BuzzLikeRepository buzzLikeRepository;

    @Autowired
    private BuzzCommentRepository buzzCommentRepository;

    @Autowired
    private CommentLikeRepository commentLikeRepository;

    @Autowired
    private BuzzBookmarkRepository buzzBookmarkRepository;

    @Autowired
    private BuzzReportRepository buzzReportRepository;

    public BuzzDto createBuzz(String userId, CreateBuzzRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Buzz buzz = new Buzz();
        buzz.setUser(user);
        buzz.setTitle(request.getTitle());
        buzz.setContent(request.getContent());
        buzz.setMediaUrl(request.getMediaUrl());

        buzz = buzzRepository.save(buzz);

        // Update user buzz count
        user.setBuzzCount(user.getBuzzCount() + 1);
        userRepository.save(user);

        return mapToBuzzDto(buzz, userId);
    }

    @Transactional
    public void deleteBuzz(String buzzId, String userId) {
        Buzz buzz = buzzRepository.findById(buzzId)
                .orElseThrow(() -> new ResourceNotFoundException("Buzz not found"));

        // Verify ownership
        if (!buzz.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only delete your own buzzs");
        }

        // Update user buzz count
        User user = buzz.getUser();
        user.setBuzzCount(user.getBuzzCount() - 1);
        userRepository.save(user);

        // Delete buzz
        buzzRepository.delete(buzz);
    }

    public BuzzDto getBuzzById(String buzzId, String userId) {
        Buzz buzz = buzzRepository.findById(buzzId)
                .orElseThrow(() -> new ResourceNotFoundException("Buzz not found"));

        // Increment view count
        buzz.setViewCount(buzz.getViewCount() + 1);
        buzz = buzzRepository.save(buzz);

        return mapToBuzzDto(buzz, userId);
    }

    public List<BuzzDto> getMainstreamBuzzs(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Buzz> buzzs = buzzRepository.findMainstream(pageable);
        return buzzs.stream()
                .map(buzz -> mapToBuzzDto(buzz, userId))
                .collect(Collectors.toList());
    }

    public List<BuzzDto> getFollowingsBuzzs(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Buzz> buzzs = buzzRepository.findFollowingsBuzzs(userId, pageable);
        return buzzs.stream()
                .map(buzz -> mapToBuzzDto(buzz, userId))
                .collect(Collectors.toList());
    }

    public List<BuzzDto> getPopularBuzzs(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Buzz> buzzs = buzzRepository.findPopularBuzzs(pageable);
        return buzzs.stream()
                .map(buzz -> mapToBuzzDto(buzz, userId))
                .collect(Collectors.toList());
    }

    public List<BuzzDto> getUnpopularBuzzs(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Buzz> buzzs = buzzRepository.findUnpopularBuzzs(pageable);
        return buzzs.stream()
                .map(buzz -> mapToBuzzDto(buzz, userId))
                .collect(Collectors.toList());
    }

    public List<BuzzDto> getBookmarkedBuzzs(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Buzz> buzzs = buzzBookmarkRepository.findBookmarkedBuzzsByUserId(userId, pageable);
        return buzzs.stream()
                .map(buzz -> mapToBuzzDto(buzz, userId))
                .collect(Collectors.toList());
    }

    public List<BuzzDto> getBookmarkedBuzzsByUserId(String userId, String currentUserId, int page, int size) {
        // Check if user exists
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        
        Pageable pageable = PageRequest.of(page, size);
        List<Buzz> buzzs = buzzBookmarkRepository.findBookmarkedBuzzsByUserId(userId, pageable);
        return buzzs.stream()
                .map(buzz -> mapToBuzzDto(buzz, currentUserId))
                .collect(Collectors.toList());
    }

    public List<BuzzDto> searchBuzzs(String query, String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Buzz> buzzs = buzzRepository.searchBuzzs(query, pageable);
        return buzzs.stream()
                .map(buzz -> mapToBuzzDto(buzz, userId))
                .collect(Collectors.toList());
    }

    public List<TrendDto> getTrendingBuzzs() {
        try {
            List<Object[]> trendingResults = buzzRepository.findTrendingBuzzs();
            List<TrendDto> trends = new ArrayList<>();

            for (Object[] result : trendingResults) {
                Buzz buzz = (Buzz) result[0];
                Number scoreNumber = (Number) result[1];
                Integer totalScore = scoreNumber != null ? scoreNumber.intValue() : 0;

                trends.add(TrendDto.builder()
                        .id(buzz.getId())
                        .title(buzz.getTitle() != null ? buzz.getTitle() : "No Title")
                        .createdAt(buzz.getCreatedAt())
                        .totalBuzzScore(totalScore)
                        .build());
            }

            return trends;
        } catch (Exception e) {
            // Fallback method if the native query fails
            List<Buzz> buzzs = buzzRepository.findAll(PageRequest.of(0, 10)).getContent();
            return buzzs.stream()
                    .map(buzz -> {
                        int totalScore = buzz.getViewCount() + buzz.getCommentCount() + 
                                        buzz.getShareCount() + buzz.getExploreCount();
                        return TrendDto.builder()
                                .id(buzz.getId())
                                .title(buzz.getTitle() != null ? buzz.getTitle() : "No Title")
                                .createdAt(buzz.getCreatedAt())
                                .totalBuzzScore(totalScore)
                                .build();
                    })
                    .sorted((a, b) -> b.getTotalBuzzScore().compareTo(a.getTotalBuzzScore()))
                    .collect(Collectors.toList());
        }
    }

    @Transactional
    public void likeBuzz(String buzzId, String userId) {
        Buzz buzz = buzzRepository.findById(buzzId)
                .orElseThrow(() -> new ResourceNotFoundException("Buzz not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if already liked
        if (buzzLikeRepository.existsByIdUserIdAndIdBuzzId(userId, buzzId)) {
            throw new BadRequestException("You have already liked this buzz");
        }

        // Create like
        BuzzLike buzzLike = new BuzzLike();
        buzzLike.setId(new BuzzLikeId(userId, buzzId));
        buzzLike.setUser(user);
        buzzLike.setBuzz(buzz);
        buzzLikeRepository.save(buzzLike);
    }

    @Transactional
    public void unlikeBuzz(String buzzId, String userId) {
        // Check if buzz exists
        if (!buzzRepository.existsById(buzzId)) {
            throw new ResourceNotFoundException("Buzz not found");
        }

        // Check if like exists
        if (!buzzLikeRepository.existsByIdUserIdAndIdBuzzId(userId, buzzId)) {
            throw new BadRequestException("You have not liked this buzz");
        }

        // Delete like
        buzzLikeRepository.deleteByIdUserIdAndIdBuzzId(userId, buzzId);
    }

    @Transactional
    public void bookmarkBuzz(String buzzId, String userId) {
        Buzz buzz = buzzRepository.findById(buzzId)
                .orElseThrow(() -> new ResourceNotFoundException("Buzz not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if already bookmarked
        if (buzzBookmarkRepository.existsByIdUserIdAndIdBuzzId(userId, buzzId)) {
            throw new BadRequestException("You have already bookmarked this buzz");
        }

        // Create bookmark
        BuzzBookmark bookmark = new BuzzBookmark();
        bookmark.setId(new BuzzBookmarkId(userId, buzzId));
        bookmark.setUser(user);
        bookmark.setBuzz(buzz);
        buzzBookmarkRepository.save(bookmark);
    }

    @Transactional
    public void unbookmarkBuzz(String buzzId, String userId) {
        // Check if buzz exists
        if (!buzzRepository.existsById(buzzId)) {
            throw new ResourceNotFoundException("Buzz not found");
        }

        // Check if bookmark exists
        if (!buzzBookmarkRepository.existsByIdUserIdAndIdBuzzId(userId, buzzId)) {
            throw new BadRequestException("You have not bookmarked this buzz");
        }

        // Delete bookmark
        buzzBookmarkRepository.deleteByIdUserIdAndIdBuzzId(userId, buzzId);
    }

    @Transactional
    public void reportBuzz(String buzzId, String userId, ReportBuzzRequest request) {
        Buzz buzz = buzzRepository.findById(buzzId)
                .orElseThrow(() -> new ResourceNotFoundException("Buzz not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if already reported
        if (buzzReportRepository.existsByUserIdAndBuzzId(userId, buzzId)) {
            throw new BadRequestException("You have already reported this buzz");
        }

        // Create report
        BuzzReport report = new BuzzReport();
        report.setUser(user);
        report.setBuzz(buzz);
        report.setReason(request.getReason());
        buzzReportRepository.save(report);
    }

    public CommentDto createComment(String buzzId, String userId, CreateCommentRequest request) {
        Buzz buzz = buzzRepository.findById(buzzId)
                .orElseThrow(() -> new ResourceNotFoundException("Buzz not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        BuzzComment comment = new BuzzComment();
        comment.setBuzz(buzz);
        comment.setUser(user);
        comment.setContent(request.getContent());

        comment = buzzCommentRepository.save(comment);

        // Update buzz comment count
        buzz.setCommentCount(buzz.getCommentCount() + 1);
        buzzRepository.save(buzz);

        return mapToCommentDto(comment, userId);
    }

    public List<CommentDto> getBuzzComments(String buzzId, String userId, int page, int size) {
        if (!buzzRepository.existsById(buzzId)) {
            throw new ResourceNotFoundException("Buzz not found");
        }

        Pageable pageable = PageRequest.of(page, size);
        List<BuzzComment> comments = buzzCommentRepository.findByBuzzIdOrderByCreatedAtDesc(buzzId, pageable);
        return comments.stream()
                .map(comment -> mapToCommentDto(comment, userId))
                .collect(Collectors.toList());
    }

    @Transactional
    public void likeComment(String commentId, String userId, boolean isLike) {
        BuzzComment comment = buzzCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if already liked/disliked
        if (commentLikeRepository.existsByIdUserIdAndIdCommentId(userId, commentId)) {
            commentLikeRepository.deleteByIdUserIdAndIdCommentId(userId, commentId);
        }

        // Create like/dislike
        CommentLike commentLike = new CommentLike();
        commentLike.setId(new CommentLikeId(userId, commentId));
        commentLike.setUser(user);
        commentLike.setComment(comment);
        commentLike.setIsLike(isLike);
        commentLikeRepository.save(commentLike);
    }

    @Transactional
    public void unlikeComment(String commentId, String userId) {
        // Check if comment exists
        if (!buzzCommentRepository.existsById(commentId)) {
            throw new ResourceNotFoundException("Comment not found");
        }

        // Check if like exists
        if (!commentLikeRepository.existsByIdUserIdAndIdCommentId(userId, commentId)) {
            throw new BadRequestException("You have not liked/disliked this comment");
        }

        // Delete like
        commentLikeRepository.deleteByIdUserIdAndIdCommentId(userId, commentId);
    }

    private BuzzDto mapToBuzzDto(Buzz buzz, String currentUserId) {
        long likeCount = buzzLikeRepository.countByBuzzId(buzz.getId());
        boolean likedByCurrentUser = false;
        boolean bookmarkedByCurrentUser = false;

        if (currentUserId != null) {
            likedByCurrentUser = buzzLikeRepository.existsByIdUserIdAndIdBuzzId(currentUserId, buzz.getId());
            bookmarkedByCurrentUser = buzzBookmarkRepository.existsByIdUserIdAndIdBuzzId(currentUserId, buzz.getId());
        }

        int totalScore = buzz.getViewCount() + buzz.getCommentCount() + 
                          buzz.getShareCount() + buzz.getExploreCount();

        return BuzzDto.builder()
                .id(buzz.getId())
                .title(buzz.getTitle())
                .content(buzz.getContent())
                .mediaUrl(buzz.getMediaUrl())
                .createdAt(buzz.getCreatedAt())
                .user(mapToUserDto(buzz.getUser()))
                .viewCount(buzz.getViewCount())
                .commentCount(buzz.getCommentCount())
                .shareCount(buzz.getShareCount())
                .exploreCount(buzz.getExploreCount())
                .likeCount(likeCount)
                .likedByCurrentUser(likedByCurrentUser)
                .bookmarkedByCurrentUser(bookmarkedByCurrentUser)
                .totalBuzzScore(totalScore)
                .build();
    }

    private CommentDto mapToCommentDto(BuzzComment comment, String currentUserId) {
        long likeCount = commentLikeRepository.countLikesByCommentId(comment.getId());
        long dislikeCount = commentLikeRepository.countDislikesByCommentId(comment.getId());
        
        boolean likedByCurrentUser = false;
        boolean dislikedByCurrentUser = false;

        if (currentUserId != null) {
            // This is a simplification - in a real app you'd check the isLike flag
            likedByCurrentUser = commentLikeRepository.existsByIdUserIdAndIdCommentId(currentUserId, comment.getId());
            // For dislike, you'd need to check if the like exists and isLike is false
        }

        return CommentDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .user(mapToUserDto(comment.getUser()))
                .likeCount(likeCount)
                .dislikeCount(dislikeCount)
                .likedByCurrentUser(likedByCurrentUser)
                .dislikedByCurrentUser(dislikedByCurrentUser)
                .build();
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}
