package com.buzzsocial.service;

import com.buzzsocial.dto.request.UpdateUserRequest;
import com.buzzsocial.dto.response.UserDto;
import com.buzzsocial.exception.BadRequestException;
import com.buzzsocial.exception.ResourceNotFoundException;
import com.buzzsocial.model.User;
import com.buzzsocial.model.UserFollower;
import com.buzzsocial.model.UserFollowerId;
import com.buzzsocial.repository.UserFollowerRepository;
import com.buzzsocial.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserFollowerRepository userFollowerRepository;

    public UserDto getUserProfile(String username, String currentUserId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserDto userDto = mapToUserDto(user);
        
        // Check if current user follows this user
        if (currentUserId != null) {
            boolean isFollowed = userFollowerRepository.existsByFollowerIdAndFollowingId(
                    currentUserId, user.getId());
            userDto.setIsFollowed(isFollowed);
        } else {
            userDto.setIsFollowed(false);
        }

        return userDto;
    }

    public UserDto updateUserProfile(String userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Update fields if provided
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getBannerUrl() != null) {
            user.setBannerUrl(request.getBannerUrl());
        }
        if (request.getInstagram() != null) {
            user.setInstagram(request.getInstagram());
        }
        if (request.getFacebook() != null) {
            user.setFacebook(request.getFacebook());
        }
        if (request.getTwitter() != null) {
            user.setTwitter(request.getTwitter());
        }
        if (request.getLinkedin() != null) {
            user.setLinkedin(request.getLinkedin());
        }
        if (request.getWebsite() != null) {
            user.setWebsite(request.getWebsite());
        }

        user = userRepository.save(user);
        return mapToUserDto(user);
    }

    @Transactional
    public void followUser(String followerId, String followingId) {
        if (followerId.equals(followingId)) {
            throw new BadRequestException("You cannot follow yourself");
        }

        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new ResourceNotFoundException("Follower user not found"));

        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new ResourceNotFoundException("Following user not found"));

        // Check if already following
        if (userFollowerRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            throw new BadRequestException("You are already following this user");
        }

        // Create follow relationship
        UserFollower userFollower = new UserFollower();
        userFollower.setId(new UserFollowerId(followerId, followingId));
        userFollower.setFollower(follower);
        userFollower.setFollowing(following);
        userFollowerRepository.save(userFollower);

        // Update counts
        follower.setFollowingsCount(follower.getFollowingsCount() + 1);
        following.setFollowersCount(following.getFollowersCount() + 1);
        userRepository.save(follower);
        userRepository.save(following);
    }

    @Transactional
    public void unfollowUser(String followerId, String followingId) {
        if (!userFollowerRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            throw new BadRequestException("You are not following this user");
        }

        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new ResourceNotFoundException("Follower user not found"));

        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new ResourceNotFoundException("Following user not found"));

        // Delete follow relationship
        userFollowerRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);

        // Update counts
        follower.setFollowingsCount(follower.getFollowingsCount() - 1);
        following.setFollowersCount(following.getFollowersCount() - 1);
        userRepository.save(follower);
        userRepository.save(following);
    }

    public List<UserDto> getUserFollowers(String userId, String currentUserId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }

        List<User> followers = userFollowerRepository.findFollowersByUserId(userId);
        return followers.stream()
                .map(user -> {
                    UserDto dto = mapToUserDto(user);
                    if (currentUserId != null) {
                        dto.setIsFollowed(userFollowerRepository.existsByFollowerIdAndFollowingId(
                                currentUserId, user.getId()));
                    } else {
                        dto.setIsFollowed(false);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<UserDto> getUserFollowings(String userId, String currentUserId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }

        List<User> followings = userFollowerRepository.findFollowingsByUserId(userId);
        return followings.stream()
                .map(user -> {
                    UserDto dto = mapToUserDto(user);
                    if (currentUserId != null) {
                        dto.setIsFollowed(userFollowerRepository.existsByFollowerIdAndFollowingId(
                                currentUserId, user.getId()));
                    } else {
                        dto.setIsFollowed(false);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<UserDto> getUserFollowersByUsername(String username, String currentUserId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return getUserFollowers(user.getId(), currentUserId);
    }

    public List<UserDto> getUserFollowingsByUsername(String username, String currentUserId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return getUserFollowings(user.getId(), currentUserId);
    }

    public List<UserDto> getUserFollowersByEmail(String email, String currentUserId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return getUserFollowers(user.getId(), currentUserId);
    }

    public List<UserDto> getUserFollowingsByEmail(String email, String currentUserId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return getUserFollowings(user.getId(), currentUserId);
    }

    public List<UserDto> discoverUsers(String currentUserId, int limit) {
        boolean isAdmin = false;
        if (currentUserId != null) {
            User currentUser = userRepository.findById(currentUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
            isAdmin = currentUser.getIsAdmin();
        }
        
        final boolean isAdminUser = isAdmin;
        
        List<User> randomUsers = userRepository.findRandomUsers(limit);
        return randomUsers.stream()
                .filter(user -> !user.getId().equals(currentUserId))
                // This line ensures admin users are filtered out if the current user is not an admin
                .filter(user -> isAdminUser || !user.getIsAdmin())
                .map(user -> {
                    UserDto dto = mapToUserDto(user);
                    if (currentUserId != null) {
                        dto.setIsFollowed(userFollowerRepository.existsByFollowerIdAndFollowingId(
                                currentUserId, user.getId()));
                    } else {
                        dto.setIsFollowed(false);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<UserDto> searchUsers(String query, String currentUserId) {
        boolean isAdmin = false;
        if (currentUserId != null) {
            User currentUser = userRepository.findById(currentUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
            isAdmin = currentUser.getIsAdmin();
        }
        
        final boolean isAdminUser = isAdmin;
        
        List<User> users = userRepository.searchUsers(query);
        return users.stream()
                // This line ensures admin users are filtered out if the current user is not an admin
                .filter(user -> isAdminUser || !user.getIsAdmin())
                .map(user -> {
                    UserDto dto = mapToUserDto(user);
                    if (currentUserId != null) {
                        dto.setIsFollowed(userFollowerRepository.existsByFollowerIdAndFollowingId(
                                currentUserId, user.getId()));
                    } else {
                        dto.setIsFollowed(false);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
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
