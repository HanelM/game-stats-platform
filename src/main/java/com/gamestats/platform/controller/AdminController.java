package com.gamestats.platform.controller;

import com.gamestats.platform.dto.UserResponse;
import com.gamestats.platform.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Admin", description = "Admin APIs")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    @Operation(
            summary = "Get all users",
            description = "Returns all registered users"
    )
    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole()
                ))
                .toList();
    }

    @Operation(
            summary = "Delete user",
            description = "Deletes a user by ID"
    )
    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable String id) {

        userRepository.deleteById(id);

        return "User deleted successfully";
    }
}