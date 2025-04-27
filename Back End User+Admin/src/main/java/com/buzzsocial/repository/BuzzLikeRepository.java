package com.buzzsocial.repository;

import com.buzzsocial.model.BuzzLike;
import com.buzzsocial.model.BuzzLikeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface BuzzLikeRepository extends JpaRepository<BuzzLike, BuzzLikeId> {
    boolean existsByIdUserIdAndIdBuzzId(String userId, String buzzId);
    
    void deleteByIdUserIdAndIdBuzzId(String userId, String buzzId);
    
    @Query("SELECT COUNT(bl) FROM BuzzLike bl WHERE bl.buzz.id = :buzzId")
    long countByBuzzId(String buzzId);
    
    @Query(value = "SELECT DATE_FORMAT(created_at, CASE " +
            "WHEN :groupBy = 'DAY' THEN '%Y-%m-%d' " +
            "WHEN :groupBy = 'WEEK' THEN '%Y-%u' " +
            "WHEN :groupBy = 'MONTH' THEN '%Y-%m' " +
            "ELSE '%Y-%m-%d' END) as time_period, COUNT(*) as count " +
            "FROM buzz_likes " +
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
