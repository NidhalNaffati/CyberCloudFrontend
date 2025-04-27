package com.buzzsocial.interceptor;

import com.buzzsocial.exception.UnauthorizedException;
import com.buzzsocial.model.User;
import com.buzzsocial.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminInterceptor implements HandlerInterceptor {

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Skip validation for OPTIONS requests (CORS preflight)
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        // Skip validation for admin registration
        if (request.getRequestURI().equals("/api/admin/dashboard/register") && 
            request.getMethod().equals("POST")) {
            return true;
        }

        String userId = (String) request.getAttribute("userId");
        if (userId == null) {
            throw new UnauthorizedException("Authentication required");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (!user.getIsAdmin()) {
            throw new UnauthorizedException("Admin access required");
        }

        return true;
    }
}
