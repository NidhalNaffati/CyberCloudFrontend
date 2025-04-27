package com.buzzsocial.interceptor;

import com.buzzsocial.config.JwtConfig;
import com.buzzsocial.exception.UnauthorizedException;
import com.buzzsocial.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtConfig jwtConfig;

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String authHeader = request.getHeader("Authorization");
        
        // Skip validation for OPTIONS requests (CORS preflight)
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        String username = jwtConfig.extractUsername(token);
        
        if (username == null) {
            throw new UnauthorizedException("Invalid token");
        }

        var userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            throw new UnauthorizedException("User not found");
        }

        var user = userOptional.get();
        
        // Double-check if user is banned - even if they somehow have a valid token
        if (user.getIsBanned()) {
            throw new UnauthorizedException("Your account has been banned");
        }

        if (!jwtConfig.validateToken(token, username)) {
            throw new UnauthorizedException("Invalid or expired token");
        }

        // Set user ID in request attributes for controllers to use
        request.setAttribute("userId", user.getId());
        request.setAttribute("username", username);
        
        return true;
    }
}
