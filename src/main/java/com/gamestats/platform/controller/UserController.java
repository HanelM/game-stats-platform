package com.gamestats.platform.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/profile")
    public String getProfile(Authentication authentication) {

        return "Welcome " + authentication.getName();
    }
}