package com.buzzsocial.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuzzDto {
    private String id;
    private String title;
    private String content;
    private String mediaUrl;
    private LocalDateTime createdAt;
    private UserDto user;
    private Integer viewCount;
    private Integer commentCount;
    private Integer shareCount;
    private Integer exploreCount;
    private Long likeCount;
    private Boolean likedByCurrentUser;
    private Boolean bookmarkedByCurrentUser;
    private Integer totalBuzzScore;
}
