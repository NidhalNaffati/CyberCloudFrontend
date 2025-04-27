package com.buzzsocial.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "buzz_bookmarks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuzzBookmark {
    @EmbeddedId
    private BuzzBookmarkId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("buzzId")
    @JoinColumn(name = "buzz_id")
    private Buzz buzz;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}