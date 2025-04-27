import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User, UserPage, UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) { }

  /**
   * Gets paginated list of users with sorting options
   * @param page Page number (zero-based)
   * @param size Number of items per page
   * @param sortBy Field to sort by (default: createdAt)
   * @param direction Sort direction (ASC or DESC)
   * @returns Observable of UserPage containing paginated user data
   */
  getUsers(page: number = 0, size: number = 10, sortBy: string = 'createdAt', direction: string = 'DESC'): Observable<UserPage> {
    return this.apiService.get<UserPage>('/api/admin/dashboard/users', {
      page,
      size,
      sortBy,
      direction
    });
  }

  /**
   * Searches for users based on a query string
   * The API will search across username, email, and fullName fields
   * @param query Search query (minimum 3 characters)
   * @returns Observable of matching User objects
   */
  searchUsers(query: string): Observable<User[]> {
    return this.apiService.get<User[]>('/api/admin/dashboard/users/search', { query });
  }

  /**
   * Bans a user by their username
   * API endpoint: POST /api/admin/dashboard/ban/user/by-username/{username}
   * Banned users cannot log in or perform any actions on the platform
   * @param username The username of the user to ban
   * @returns Observable of the API response
   */
  banUserByUsername(username: string): Observable<any> {
    return this.apiService.post<any>(`/api/admin/dashboard/ban/user/by-username/${username}`, {});
  }
  
  /**
   * Unbans a user by their username
   * API endpoint: POST /api/admin/dashboard/unban/user/by-username/{username}
   * Restores normal access for previously banned users
   * @param username The username of the user to unban
   * @returns Observable of the API response
   */
  unbanUserByUsername(username: string): Observable<any> {
    return this.apiService.post<any>(`/api/admin/dashboard/unban/user/by-username/${username}`, {});
  }
  
  /**
   * Gets a list of all banned users
   * API endpoint: GET /api/admin/dashboard/users/banned
   * @returns Observable of banned User objects
   */
  getBannedUsers(): Observable<User[]> {
    return this.apiService.get<User[]>('/api/admin/dashboard/users/banned');
  }
  
  /**
   * Bans a user by their email address
   * API endpoint: POST /api/admin/dashboard/ban/user/by-email/{email}
   * @param email The email of the user to ban
   * @returns Observable of the API response
   */
  banUserByEmail(email: string): Observable<any> {
    return this.apiService.post<any>(`/api/admin/dashboard/ban/user/by-email/${email}`, {});
  }
  
  /**
   * Unbans a user by their email address
   * API endpoint: POST /api/admin/dashboard/unban/user/by-email/{email}
   * @param email The email of the user to unban
   * @returns Observable of the API response
   */
  unbanUserByEmail(email: string): Observable<any> {
    return this.apiService.post<any>(`/api/admin/dashboard/unban/user/by-email/${email}`, {});
  }

  /**
   * Gets list of users that a specific user is following
   * API endpoint: GET /api/admin/dashboard/users/{userId}/followings
   * @param userId The unique ID of the user
   * @returns Observable of UserProfile objects the user is following
   */
  getUserFollowings(userId: string): Observable<UserProfile[]> {
    return this.apiService.get<UserProfile[]>(`/api/admin/dashboard/users/${userId}/followings`);
  }

  /**
   * Gets list of users who follow a specific user
   * API endpoint: GET /api/admin/dashboard/users/{userId}/followers
   * @param userId The unique ID of the user
   * @returns Observable of UserProfile objects who follow the user
   */
  getUserFollowers(userId: string): Observable<UserProfile[]> {
    return this.apiService.get<UserProfile[]>(`/api/admin/dashboard/users/${userId}/followers`);
  }

  /**
   * Gets list of users that a specific user is following (lookup by username)
   * API endpoint: GET /api/admin/dashboard/users/by-username/{username}/followings
   * @param username The username of the user
   * @returns Observable of UserProfile objects the user is following
   */
  getUserFollowingsByUsername(username: string): Observable<UserProfile[]> {
    return this.apiService.get<UserProfile[]>(`/api/admin/dashboard/users/by-username/${username}/followings`);
  }

  /**
   * Gets list of users who follow a specific user (lookup by username)
   * API endpoint: GET /api/admin/dashboard/users/by-username/{username}/followers
   * @param username The username of the user
   * @returns Observable of UserProfile objects who follow the user
   */
  getUserFollowersByUsername(username: string): Observable<UserProfile[]> {
    return this.apiService.get<UserProfile[]>(`/api/admin/dashboard/users/by-username/${username}/followers`);
  }

  /**
   * Gets list of users that a specific user is following (lookup by email)
   * API endpoint: GET /api/admin/dashboard/users/by-email/{email}/followings
   * @param email The email of the user
   * @returns Observable of UserProfile objects the user is following
   */
  getUserFollowingsByEmail(email: string): Observable<UserProfile[]> {
    return this.apiService.get<UserProfile[]>(`/api/admin/dashboard/users/by-email/${email}/followings`);
  }

  /**
   * Gets list of users who follow a specific user (lookup by email)
   * API endpoint: GET /api/admin/dashboard/users/by-email/{email}/followers
   * @param email The email of the user
   * @returns Observable of UserProfile objects who follow the user
   */
  getUserFollowersByEmail(email: string): Observable<UserProfile[]> {
    return this.apiService.get<UserProfile[]>(`/api/admin/dashboard/users/by-email/${email}/followers`);
  }
}
