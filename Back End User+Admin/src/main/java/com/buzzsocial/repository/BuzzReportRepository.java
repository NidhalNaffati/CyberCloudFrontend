package com.buzzsocial.repository;

import com.buzzsocial.model.BuzzReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface BuzzReportRepository extends JpaRepository<BuzzReport, String> {
    boolean existsByUserIdAndBuzzId(String userId, String buzzId);
    
    List<BuzzReport> findByStatus(BuzzReport.ReportStatus status);
    
    long countByStatus(BuzzReport.ReportStatus status);
    
    List<BuzzReport> findByReasonContainingIgnoreCase(String query);
    
    @Query(value = "SELECT DATE_FORMAT(created_at, CASE " +
            "WHEN :groupBy = 'DAY' THEN '%Y-%m-%d' " +
            "WHEN :groupBy = 'WEEK' THEN '%Y-%u' " +
            "WHEN :groupBy = 'MONTH' THEN '%Y-%m' " +
            "ELSE '%Y-%m-%d' END) as time_period, COUNT(*) as count " +
            "FROM buzz_reports " +
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
