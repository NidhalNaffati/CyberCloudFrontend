package com.buzzsocial.repository;

import com.buzzsocial.model.CommentLike;
import com.buzzsocial.model.CommentLikeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike, CommentLikeId> {
    boolean existsByIdUserIdAndIdCommentId(String userId, String commentId);
    
    void deleteByIdUserIdAndIdCommentId(String userId, String commentId);
    
    @Query("SELECT COUNT(cl) FROM CommentLike cl WHERE cl.comment.id = :commentId AND cl.isLike = true")
    long countLikesByCommentId(String commentId);
    
    @Query("SELECT COUNT(cl) FROM CommentLike cl WHERE cl.comment.id = :commentId AND cl.isLike = false")
    long countDislikesByCommentId(String commentId);
}
