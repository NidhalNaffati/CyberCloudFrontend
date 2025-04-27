package com.buzzsocial.repository;

import com.buzzsocial.model.Buzz;
import com.buzzsocial.model.BuzzBookmark;
import com.buzzsocial.model.BuzzBookmarkId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BuzzBookmarkRepository extends JpaRepository<BuzzBookmark, BuzzBookmarkId> {
    boolean existsByIdUserIdAndIdBuzzId(String userId, String buzzId);
    
    void deleteByIdUserIdAndIdBuzzId(String userId, String buzzId);
    
    @Query("SELECT bb.buzz FROM BuzzBookmark bb WHERE bb.user.id = :userId ORDER BY bb.createdAt DESC")
    List<Buzz> findBookmarkedBuzzsByUserId(String userId, Pageable pageable);
}
