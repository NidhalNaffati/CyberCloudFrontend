package com.buzzsocial.service;

import com.buzzsocial.dto.request.CreateAdminRequest;
import com.buzzsocial.dto.response.BuzzDto;
import com.buzzsocial.dto.response.CommentDto;
import com.buzzsocial.dto.response.UserDto;
import com.buzzsocial.exception.BadRequestException;
import com.buzzsocial.exception.ResourceNotFoundException;
import com.buzzsocial.exception.UnauthorizedException;
import com.buzzsocial.model.*;
import com.buzzsocial.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Value("${admin.secret.key}")
    private String adminSecretKey;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BuzzRepository buzzRepository;

    @Autowired
    private BuzzCommentRepository commentRepository;

    @Autowired
    private BuzzReportRepository reportRepository;

    @Autowired
    private UserFollowerRepository followerRepository;

    @Autowired
    private BuzzLikeRepository buzzLikeRepository;

    public User createAdmin(CreateAdminRequest request) {
        // Validate admin secret key
        if (!adminSecretKey.equals(request.getAdminSecretKey())) {
            throw new UnauthorizedException("Invalid admin secret key");
        }

        // Validate username and email uniqueness
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Create new admin user
        User admin = new User();
        admin.setFullName(request.getFullName());
        admin.setBirthDate(request.getBirthDate());
        admin.setEmail(request.getEmail());
        admin.setUsername(request.getUsername());
        admin.setPassword(request.getPassword());
        admin.setIsAdmin(true);

        return userRepository.save(admin);
    }

    public Page<User> getAllUsers(int page, int size, String sortBy, String direction) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return userRepository.findAll(pageable);
    }

    public List<User> getAllBannedUsers() {
        return userRepository.findByIsBanned(true);
    }

    public List<User> searchUsers(String query) {
        return userRepository.searchUsers(query);
    }

    public Page<Buzz> getAllBuzzs(int page, int size, String sortBy, String direction) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return buzzRepository.findAll(pageable);
    }

    public List<Buzz> searchBuzzs(String query) {
        Pageable pageable = PageRequest.of(0, 100);
        return buzzRepository.searchBuzzs(query, pageable);
    }

    public Page<BuzzComment> getAllComments(int page, int size, String sortBy, String direction) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return commentRepository.findAll(pageable);
    }

    public List<BuzzComment> searchComments(String query) {
        return commentRepository.findByContentContainingIgnoreCase(query);
    }

    @Transactional
    public void banUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        user.setIsBanned(true);
        userRepository.save(user);
    }

    @Transactional
    public void banUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        user.setIsBanned(true);
        userRepository.save(user);
    }

    @Transactional
    public void unbanUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        user.setIsBanned(false);
        userRepository.save(user);
    }

    @Transactional
    public void unbanUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        user.setIsBanned(false);
        userRepository.save(user);
    }

    @Transactional
    public void deleteBuzz(String buzzId) {
        Buzz buzz = buzzRepository.findById(buzzId)
                .orElseThrow(() -> new ResourceNotFoundException("Buzz not found"));
        
        // Update user buzz count
        User user = buzz.getUser();
        user.setBuzzCount(user.getBuzzCount() - 1);
        userRepository.save(user);
        
        // Delete buzz
        buzzRepository.delete(buzz);
    }

    @Transactional
    public void deleteComment(String commentId) {
        BuzzComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        
        // Update buzz comment count
        Buzz buzz = comment.getBuzz();
        buzz.setCommentCount(buzz.getCommentCount() - 1);
        buzzRepository.save(buzz);
        
        // Delete comment
        commentRepository.delete(comment);
    }

    public List<UserDto> getUserFollowers(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<User> followers = followerRepository.findFollowersByUserId(userId);
        return followers.stream()
                .map(this::mapToUserDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> getUserFollowings(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<User> followings = followerRepository.findFollowingsByUserId(userId);
        return followings.stream()
                .map(this::mapToUserDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> getUserFollowersByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return getUserFollowers(user.getId());
    }

    public List<UserDto> getUserFollowingsByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return getUserFollowings(user.getId());
    }

    public List<UserDto> getUserFollowersByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return getUserFollowers(user.getId());
    }

    public List<UserDto> getUserFollowingsByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return getUserFollowings(user.getId());
    }

    public Map<String, Object> getDashboardStats(LocalDate startDate, LocalDate endDate, String groupBy) {
        // Set default dates if not provided
        if (startDate == null) {
            startDate = LocalDate.now().minusMonths(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();
        
        // Basic stats
        long totalUsers = userRepository.count();
        long adminUsers = userRepository.countByIsAdmin(true);
        long regularUsers = totalUsers - adminUsers;
        long totalBuzzs = buzzRepository.count();
        long totalComments = commentRepository.count();
        long totalReports = reportRepository.count();
        long pendingReports = reportRepository.countByStatus(BuzzReport.ReportStatus.PENDING);
        long bannedUsers = userRepository.countByIsBanned(true);
        
        // Time-based stats
        Map<String, Long> likesOverTime = buzzLikeRepository.countByTimeRange(startDateTime, endDateTime, groupBy);
        Map<String, Long> reportsOverTime = reportRepository.countByTimeRange(startDateTime, endDateTime, groupBy);
        Map<String, Long> buzzsOverTime = buzzRepository.countByTimeRange(startDateTime, endDateTime, groupBy);
        Map<String, Long> commentsOverTime = commentRepository.countByTimeRange(startDateTime, endDateTime, groupBy);
        Map<String, Long> usersOverTime = userRepository.countByTimeRange(startDateTime, endDateTime, groupBy);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("adminUsers", adminUsers);
        stats.put("regularUsers", regularUsers);
        stats.put("totalBuzzs", totalBuzzs);
        stats.put("totalComments", totalComments);
        stats.put("totalReports", totalReports);
        stats.put("pendingReports", pendingReports);
        stats.put("bannedUsers", bannedUsers);
        stats.put("likesOverTime", likesOverTime);
        stats.put("reportsOverTime", reportsOverTime);
        stats.put("buzzsOverTime", buzzsOverTime);
        stats.put("commentsOverTime", commentsOverTime);
        stats.put("usersOverTime", usersOverTime);
        
        return stats;
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .birthDate(user.getBirthDate())
                .avatarUrl(user.getAvatarUrl())
                .bannerUrl(user.getBannerUrl())
                .bio(user.getBio())
                .instagram(user.getInstagram())
                .facebook(user.getFacebook())
                .twitter(user.getTwitter())
                .linkedin(user.getLinkedin())
                .website(user.getWebsite())
                .followersCount(user.getFollowersCount())
                .followingsCount(user.getFollowingsCount())
                .buzzCount(user.getBuzzCount())
                .isBanned(user.getIsBanned())
                .isAdmin(user.getIsAdmin())
                .joinedAt(user.getCreatedAt())
                .build();
    }
}
