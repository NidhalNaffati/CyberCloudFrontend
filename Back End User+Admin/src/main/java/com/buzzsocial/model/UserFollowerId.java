package com.buzzsocial.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserFollowerId implements Serializable {
    @Column(name = "follower_id", length = 36)
    private String followerId;

    @Column(name = "following_id", length = 36)
    private String followingId;
}