-- Analytics Schema for Buzz Social Platform

-- User Analytics Table
CREATE TABLE user_analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date_key DATE NOT NULL,
    week_key VARCHAR(10) NOT NULL,
    month_key VARCHAR(7) NOT NULL,
    total_users INT NOT NULL,
    admin_users INT NOT NULL,
    regular_users INT NOT NULL,
    new_users INT NOT NULL,
    banned_users INT NOT NULL,
    active_users INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date_key),
    INDEX idx_week (week_key),
    INDEX idx_month (month_key)
);

-- Buzz Analytics Table
CREATE TABLE buzz_analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date_key DATE NOT NULL,
    week_key VARCHAR(10) NOT NULL,
    month_key VARCHAR(7) NOT NULL,
    total_buzzs INT NOT NULL,
    new_buzzs INT NOT NULL,
    deleted_buzzs INT NOT NULL,
    views_count INT NOT NULL,
    shares_count INT NOT NULL,
    explore_count INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date_key),
    INDEX idx_week (week_key),
    INDEX idx_month (month_key)
);

-- Comment Analytics Table
CREATE TABLE comment_analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date_key DATE NOT NULL,
    week_key VARCHAR(10) NOT NULL,
    month_key VARCHAR(7) NOT NULL,
    total_comments INT NOT NULL,
    new_comments INT NOT NULL,
    deleted_comments INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date_key),
    INDEX idx_week (week_key),
    INDEX idx_month (month_key)
);

-- Like Analytics Table
CREATE TABLE like_analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date_key DATE NOT NULL,
    week_key VARCHAR(10) NOT NULL,
    month_key VARCHAR(7) NOT NULL,
    buzz_likes INT NOT NULL,
    comment_likes INT NOT NULL,
    comment_dislikes INT NOT NULL,
    total_likes INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date_key),
    INDEX idx_week (week_key),
    INDEX idx_month (month_key)
);

-- Report Analytics Table
CREATE TABLE report_analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date_key DATE NOT NULL,
    week_key VARCHAR(10) NOT NULL,
    month_key VARCHAR(7) NOT NULL,
    total_reports INT NOT NULL,
    new_reports INT NOT NULL,
    pending_reports INT NOT NULL,
    reviewed_reports INT NOT NULL,
    dismissed_reports INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date_key),
    INDEX idx_week (week_key),
    INDEX idx_month (month_key)
);

-- Follower Analytics Table
CREATE TABLE follower_analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date_key DATE NOT NULL,
    week_key VARCHAR(10) NOT NULL,
    month_key VARCHAR(7) NOT NULL,
    new_follows INT NOT NULL,
    unfollows INT NOT NULL,
    total_follows INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date_key),
    INDEX idx_week (week_key),
    INDEX idx_month (month_key)
);

-- Stored Procedure to Populate Daily Analytics
DELIMITER //
CREATE PROCEDURE populate_daily_analytics()
BEGIN
    DECLARE curr_date DATE;
    DECLARE curr_week VARCHAR(10);
    DECLARE curr_month VARCHAR(7);
    
    SET curr_date = CURDATE();
    SET curr_week = DATE_FORMAT(curr_date, '%Y-%u');
    SET curr_month = DATE_FORMAT(curr_date, '%Y-%m');
    
    -- User Analytics
    INSERT INTO user_analytics (
        date_key, week_key, month_key, total_users, admin_users, 
        regular_users, new_users, banned_users, active_users
    )
    SELECT 
        curr_date,
        curr_week,
        curr_month,
        COUNT(*),
        SUM(CASE WHEN is_admin = TRUE THEN 1 ELSE 0 END),
        SUM(CASE WHEN is_admin = FALSE THEN 1 ELSE 0 END),
        SUM(CASE WHEN DATE(created_at) = curr_date THEN 1 ELSE 0 END),
        SUM(CASE WHEN is_banned = TRUE THEN 1 ELSE 0 END),
        SUM(CASE WHEN DATE(updated_at) = curr_date THEN 1 ELSE 0 END)
    FROM users;
    
    -- Buzz Analytics
    INSERT INTO buzz_analytics (
        date_key, week_key, month_key, total_buzzs, new_buzzs, 
        deleted_buzzs, views_count, shares_count, explore_count
    )
    SELECT 
        curr_date,
        curr_week,
        curr_month,
        COUNT(*),
        SUM(CASE WHEN DATE(created_at) = curr_date THEN 1 ELSE 0 END),
        0, -- Deleted buzzs would need a separate tracking mechanism
        SUM(view_count),
        SUM(share_count),
        SUM(explore_count)
    FROM buzzs;
    
    -- Comment Analytics
    INSERT INTO comment_analytics (
        date_key, week_key, month_key, total_comments, new_comments, deleted_comments
    )
    SELECT 
        curr_date,
        curr_week,
        curr_month,
        COUNT(*),
        SUM(CASE WHEN DATE(created_at) = curr_date THEN 1 ELSE 0 END),
        0 -- Deleted comments would need a separate tracking mechanism
    FROM buzz_comments;
    
    -- Like Analytics
    INSERT INTO like_analytics (
        date_key, week_key, month_key, buzz_likes, comment_likes, comment_dislikes, total_likes
    )
    SELECT 
        curr_date,
        curr_week,
        curr_month,
        (SELECT COUNT(*) FROM buzz_likes),
        (SELECT COUNT(*) FROM comment_likes WHERE is_like = TRUE),
        (SELECT COUNT(*) FROM comment_likes WHERE is_like = FALSE),
        (SELECT COUNT(*) FROM buzz_likes) + (SELECT COUNT(*) FROM comment_likes WHERE is_like = TRUE)
    FROM dual;
    
    -- Report Analytics
    INSERT INTO report_analytics (
        date_key, week_key, month_key, total_reports, new_reports, 
        pending_reports, reviewed_reports, dismissed_reports
    )
    SELECT 
        curr_date,
        curr_week,
        curr_month,
        COUNT(*),
        SUM(CASE WHEN DATE(created_at) = curr_date THEN 1 ELSE 0 END),
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END),
        SUM(CASE WHEN status = 'REVIEWED' THEN 1 ELSE 0 END),
        SUM(CASE WHEN status = 'DISMISSED' THEN 1 ELSE 0 END)
    FROM buzz_reports;
    
    -- Follower Analytics
    INSERT INTO follower_analytics (
        date_key, week_key, month_key, new_follows, unfollows, total_follows
    )
    SELECT 
        curr_date,
        curr_week,
        curr_month,
        SUM(CASE WHEN DATE(created_at) = curr_date THEN 1 ELSE 0 END),
        0, -- Unfollows would need a separate tracking mechanism
        COUNT(*)
    FROM user_followers;
END //
DELIMITER ;

-- Event to run the analytics procedure daily
CREATE EVENT IF NOT EXISTS daily_analytics_event
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_DATE + INTERVAL 1 DAY
DO
    CALL populate_daily_analytics();
