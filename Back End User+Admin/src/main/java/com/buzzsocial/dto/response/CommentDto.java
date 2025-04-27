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
public class CommentDto {
    private String id;
    private String content;
    private LocalDateTime createdAt;
    private UserDto user;
    private Long likeCount;
    private Long dislikeCount;
    private Boolean likedByCurrentUser;
    private Boolean dislikedByCurrentUser;
}
