package com.rj.appSecurity.controller;

import com.rj.appSecurity.domain.userDto.Response;
import com.rj.appSecurity.domain.userDto.UserRequestDto;
import com.rj.appSecurity.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

import static com.rj.appSecurity.utils.RequestUtils.getResponse;
import static java.util.Collections.emptyMap;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;



    @PostMapping("/register")
    public ResponseEntity<Response> register(@RequestBody @Valid UserRequestDto user, HttpServletRequest request) {
        userService.createUser(user.getFirstName(), user.getLastName(), user.getEmail(), user.getPassword());
        return ResponseEntity.created(getUri()).body(getResponse(request, emptyMap(), "Account created . check your email to enable your account ", CREATED));
    }

    @GetMapping("/verify/account")
    public ResponseEntity<Response> verifyAccount(@RequestParam("key") String key, HttpServletRequest request) {
        userService.verifyAccount(key);
        return ResponseEntity.created(getUri()).body(getResponse(request, emptyMap(), "Account verified", OK));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRequestDto user) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(user.getEmail(), user.getPassword())
            );
            Map<String, Object> response = Map.of(
                "email", user.getEmail(),
                "message", "Login successful",
                "token", "dummy-jwt-token"
            );
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            // Return error details for debugging
            return ResponseEntity.status(500).body(Map.of(
                "error", "Login failed",
                "message", ex.getMessage(),
                "exception", ex.getClass().getSimpleName()
            ));
        }
    }

    private URI getUri() {
        return URI.create("");
    }

}
