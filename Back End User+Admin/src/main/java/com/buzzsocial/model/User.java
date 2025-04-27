package com.buzzsocial.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @Column(length = 36)
    private String id = UUID.randomUUID().toString();

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true, length = 30)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "banner_url")
    private String bannerUrl;

    private String bio;

    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'https://instagram.com/'")
    private String instagram = "https://instagram.com/";

    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'https://facebook.com/'")
    private String facebook = "https://facebook.com/";

    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'https://x.com/'")
    private String twitter = "https://x.com/";

    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'https://linkedin.com/in/'")
    private String linkedin = "https://linkedin.com/in/";

    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'https://'")
    private String website = "https://";

    @Column(name = "followers_count", columnDefinition = "INT DEFAULT 0")
    private Integer followersCount = 0;

    @Column(name = "followings_count", columnDefinition = "INT DEFAULT 0")
    private Integer followingsCount = 0;

    @Column(name = "buzz_count", columnDefinition = "INT DEFAULT 0")
    private Integer buzzCount = 0;

    @Column(name = "is_banned", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isBanned = false;

    @Column(name = "is_admin", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isAdmin = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}