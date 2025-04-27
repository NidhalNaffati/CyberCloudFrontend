package com.buzzsocial.repository;

import com.buzzsocial.model.Buzz;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface BuzzRepository extends JpaRepository<Buzz, String> {
    List<Buzz> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    
    @Query("SELECT b FROM Buzz b ORDER BY b.createdAt DESC")
    List<Buzz> findMainstream(Pageable pageable);
    
    @Query("SELECT b FROM Buzz b WHERE b.user.id IN " +
           "(SELECT uf.following.id FROM UserFollower uf WHERE uf.follower.id = :userId) " +
           "ORDER BY b.createdAt DESC")
    List<Buzz> findFollowingsBuzzs(String userId, Pageable pageable);
    
    @Query("SELECT b FROM Buzz b ORDER BY (b.viewCount + b.commentCount + b.shareCount + b.exploreCount) DESC")
    List<Buzz> findPopularBuzzs(Pageable pageable);
    
    @Query("SELECT b FROM Buzz b ORDER BY (b.viewCount + b.commentCount + b.shareCount + b.exploreCount) ASC")
    List<Buzz> findUnpopularBuzzs(Pageable pageable);
    
    @Query("SELECT b FROM Buzz b WHERE b.title LIKE %:query% OR b.content LIKE %:query%")
    List<Buzz> searchBuzzs(String query, Pageable pageable);
    
    @Query(value = "SELECT b.*, (b.view_count + b.comment_count + b.share_count + b.explore_count) as total_score " +
                  "FROM buzzs b ORDER BY total_score DESC LIMIT 10", nativeQuery = true)
    List<Object[]> findTrendingBuzzs();
    
    @Query(value = "SELECT DATE_FORMAT(created_at, CASE " +
            "WHEN :groupBy = 'DAY' THEN '%Y-%m-%d' " +
            "WHEN :groupBy = 'WEEK' THEN '%Y-%u' " +
            "WHEN :groupBy = 'MONTH' THEN '%Y-%m' " +
            "ELSE '%Y-%m-%d' END) as time_period, COUNT(*) as count " +
            "FROM buzzs " +
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
