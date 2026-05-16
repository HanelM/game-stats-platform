package com.gamestats.platform.dto;

import com.gamestats.platform.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {

    private String id;
    private String username;
    private String email;
    private UserRole role;
}