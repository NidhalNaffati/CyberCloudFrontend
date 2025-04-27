package com.buzzsocial.repository;

import com.buzzsocial.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    List<User> findByIsBanned(boolean isBanned);
    
    @Query("SELECT u FROM User u WHERE u.username LIKE %:query% OR u.fullName LIKE %:query% OR u.email LIKE %:query%")
    List<User> searchUsers(String query);
    
    @Query(value = "SELECT * FROM users ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<User> findRandomUsers(int limit);
    
    long countByIsBanned(boolean isBanned);
    
    long countByIsAdmin(boolean isAdmin);
    
    @Query(value = "SELECT DATE_FORMAT(created_at, CASE " +
            "WHEN :groupBy = 'DAY' THEN '%Y-%m-%d' " +
            "WHEN :groupBy = 'WEEK' THEN '%Y-%u' " +
            "WHEN :groupBy = 'MONTH' THEN '%Y-%m' " +
            "ELSE '%Y-%m-%d' END) as time_period, COUNT(*) as count " +
            "FROM users " +
            "WHERE created_at BETWEEN :startDate AND :endDate " +
            "GROUP BY time_period " +
            "ORDER BY time_period", nativeQuery = true)
    List<Object[]> countByCreatedAtBetweenGroupBy(LocalDateTime startDate, LocalDateTime endDate, String groupBy);
    
    default Map<String, Long> countByTimeRange(LocalDateTime startDate, LocalDateTime endDate, String groupBy) {
        List<Object[]> results = countByCreatedAtBetweenGroupBy(startDate, endDate, groupBy);
        Map<String, Long> counts = new java.util.HashMap<>();
        
        for (Object[] result : results) {
            String timePeriod = (String) result[0];
            Long count = ((Number) result[1]).longValue();
            counts.put(timePeriod, count);
        }
        
        return counts;
    }
}
