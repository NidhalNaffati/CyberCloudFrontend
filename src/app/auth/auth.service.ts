import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, firstValueFrom} from 'rxjs';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';

interface AuthenticationResponse {
  access_token: string;
  refresh_token: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface EditProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthenticationRequest {
  email: string;
  password: string;
}

interface VerifyAccountRequest {
  email: string;
  code: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/v1/auth`;
  private jwtHelper = new JwtHelperService();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private userRoleSubject = new BehaviorSubject<string | null>(this.getUserRole());

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Check token validity on service initialization
    if (this.hasValidToken()) {
      this.setAuthHeaders();
    }
  }

  private handleError(error: HttpErrorResponse): never {
    console.error('API Error:', error.message);

    let errorMessage = 'An error occurred while processing your request.';
    if (error.error) {
      if (typeof error.error === 'string') {
        try {
          const parsedError = JSON.parse(error.error);
          errorMessage = parsedError.message || errorMessage;
        } catch {
          errorMessage = error.error;
        }
      } else if (error.error.message) {
        errorMessage = error.error.message;
      }
    }
    const enhancedError = new Error(errorMessage);
    (enhancedError as any).originalError = error;
    (enhancedError as any).status = error.status;
    throw enhancedError;
  }

  async register(registerData: RegisterRequest, file?: File): Promise<string> {
    try {
      if (registerData.role === 'ROLE_MEDECIN' && file) {
        const formData = new FormData();
        formData.append('request', new Blob([JSON.stringify(registerData)], {type: 'application/json'}));
        formData.append('document', file);
        return await firstValueFrom(
          this.http.post(`${this.apiUrl}/register/medecin`, formData, {responseType: 'text'})
        );
      } else {
        const endpoint = registerData.role === 'ROLE_USER' ? `${this.apiUrl}/register/user` : `${this.apiUrl}/register`;
        return await firstValueFrom(
          this.http.post(endpoint, registerData, {responseType: 'text'})
        );
      }
    } catch (error) {
      return this.handleError(error as HttpErrorResponse);
    }
  }

  async verifyAccount(email: string, code: string): Promise<string> {
    try {
      const verifyRequest: VerifyAccountRequest = {email, code};
      return await firstValueFrom(
        this.http.post<string>(`${this.apiUrl}/verify-user`, verifyRequest, {responseType: 'text' as 'json'})
      );
    } catch (error) {
      return this.handleError(error as HttpErrorResponse);
    }
  }

  async login(email: string, password: string): Promise<AuthenticationResponse> {
    try {
      const authRequest: AuthenticationRequest = {email, password};
      const response = await firstValueFrom(
        this.http.post<AuthenticationResponse>(`${this.apiUrl}/authenticate`, authRequest)
      );
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      // Set auth headers
      this.setAuthHeaders();
      const userRole = this.extractUserRoleFromToken(response.access_token);
      this.isAuthenticatedSubject.next(true);
      this.userRoleSubject.next(userRole);

      // Redirect based on user role
      this.redirectBasedOnRole(userRole);

      return response;
    } catch (error) {
      return this.handleError(error as HttpErrorResponse);
    }
  }

  // New method to handle role-based redirection
  redirectBasedOnRole(role: string | null): void {
    if (role === 'ROLE_ADMIN') {
      this.router.navigate(['/admin']).then(r => console.log('Redirected to admin'));
    } else {
      this.router.navigate(['/']).then(r => console.log('Redirected to home'));
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Update auth state
    this.isAuthenticatedSubject.next(false);
    this.userRoleSubject.next(null);
    this.router.navigate(['auth/login']).then(r => console.log('logged out'));
  }

  async requestPasswordReset(email: string): Promise<string> {
    try {
      const request: ForgotPasswordRequest = {email};
      return await firstValueFrom(
        this.http.post<string>(`${this.apiUrl}/forgot-password`, request)
      );
    } catch (error) {
      return this.handleError(error as HttpErrorResponse);
    }
  }

  async resetPassword(email: string, code: string, newPassword: string, confirmPassword: string): Promise<string> {
    try {
      const request: ResetPasswordRequest = {email, code, newPassword, confirmPassword};
      return await firstValueFrom(
        this.http.post<string>(`${this.apiUrl}/reset-password`, request)
      );
    } catch (error) {
      return this.handleError(error as HttpErrorResponse);
    }
  }

  async refreshToken(): Promise<{ access_token: string }> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.logout();
      throw new Error('No refresh token available');
    }
    try {
      const response = await firstValueFrom(
        this.http.post<{ access_token: string }>(`${this.apiUrl}/refresh-token`, {refresh_token: refreshToken})
      );
      localStorage.setItem('access_token', response.access_token);
      this.setAuthHeaders();
      return response;
    } catch (error) {
      console.error('Refresh token error:', error);
      this.logout();
      return this.handleError(error as HttpErrorResponse);
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUserRole(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.role;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ROLE_ADMIN';
  }

  isUser(): boolean {
    return this.getUserRole() === 'ROLE_USER';
  }

  hasValidToken(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  private extractUserRoleFromToken(token: string): string {
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken.role;
  }

  private setAuthHeaders(): void {
    const token = this.getAccessToken();
    if (token) {
      // Note: In Angular, you would typically handle this in an HTTP interceptor
      console.log('Setting auth header with token');
    }
  }

  getUserEmail(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.sub || decodedToken.email || null;
    } catch (error) {
      console.error('Error decoding token for email:', error);
      return null;
    }
  }
  getUserFullName(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return `${decodedToken.firstName} ${decodedToken.lastName}`;
    } catch (error) {
      console.error('Error decoding token for full name:', error);
      return null;
    }
  }

  getUserPhoneNumber(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.phoneNumber || null;
    } catch (error) {
      console.error('Error decoding token for phone number:', error);
      return null;
    }
  }
  getUserId(): number | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.id_user ?? null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  async getUserProfile(): Promise<any> {
    try {
      return await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/profile`)
      );
    } catch (error) {
      return this.handleError(error as HttpErrorResponse);
    }
  }

  async updateProfile(editProfile: EditProfileRequest): Promise<string> {
    try {
      return await firstValueFrom(
        this.http.put(`${this.apiUrl}/profile`, editProfile, {responseType: 'text'})
      );
    } catch (error) {
      return this.handleError(error as HttpErrorResponse);
    }
  }
}
