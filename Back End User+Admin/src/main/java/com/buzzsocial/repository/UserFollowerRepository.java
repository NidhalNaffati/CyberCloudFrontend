package com.buzzsocial.repository;

import com.buzzsocial.model.User;
import com.buzzsocial.model.UserFollower;
import com.buzzsocial.model.UserFollowerId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserFollowerRepository extends JpaRepository<UserFollower, UserFollowerId> {
    @Query("SELECT uf.following FROM UserFollower uf WHERE uf.follower.id = :userId")
    List<User> findFollowingsByUserId(String userId);
    
    @Query("SELECT uf.follower FROM UserFollower uf WHERE uf.following.id = :userId")
    List<User> findFollowersByUserId(String userId);
    
    boolean existsByFollowerIdAndFollowingId(String followerId, String followingId);
    
    void deleteByFollowerIdAndFollowingId(String followerId, String followingId);
}
