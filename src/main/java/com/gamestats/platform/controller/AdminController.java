package com.gamestats.platform.controller;

import com.gamestats.platform.dto.UserResponse;
import com.gamestats.platform.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Sort;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;




@Tag(name = "Admin", description = "Admin APIs")
@SecurityRequirement(name = "bearerAuth")
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
    public ResponseEntity<Page<UserResponse>> getAllUsers(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size,

            @RequestParam(defaultValue = "username")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String direction
    ) {

        Pageable pageable =
                PageRequest.of(

                        page,

                        size,

                        direction.equalsIgnoreCase("asc")
                                ? Sort.by(sortBy).ascending()
                                : Sort.by(sortBy).descending()
                );

        Page<UserResponse> users =
                userRepository.findAll(pageable)
                        .map(user -> new UserResponse(
                                user.getId(),
                                user.getUsername(),
                                user.getEmail(),
                                user.getRole()
                        ));

        return ResponseEntity.ok(users);
    }
    @Operation(
            summary = "Search users",
            description = "Search users by username or email"
    )
    @GetMapping("/users/search")
    public Page<UserResponse> searchUsers(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            Pageable pageable
    ) {

        if (username != null) {

            return userRepository
                    .findByUsernameContainingIgnoreCase(
                            username,
                            pageable
                    )
                    .map(user -> new UserResponse(
                            user.getId(),
                            user.getUsername(),
                            user.getEmail(),
                            user.getRole()
                    ));
        }

        if (email != null) {

            return userRepository
                    .findByEmailContainingIgnoreCase(
                            email,
                            pageable
                    )
                    .map(user -> new UserResponse(
                            user.getId(),
                            user.getUsername(),
                            user.getEmail(),
                            user.getRole()
                    ));
        }

        return Page.empty();
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