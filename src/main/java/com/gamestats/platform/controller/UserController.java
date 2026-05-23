package com.gamestats.platform.controller;

import com.gamestats.platform.dto.LeaderboardResponse;
import com.gamestats.platform.dto.UserResponse;
import com.gamestats.platform.model.GameMatch;
import com.gamestats.platform.model.User;
import com.gamestats.platform.repository.GameMatchRepository;
import com.gamestats.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.security.core.Authentication;

import java.util.List;

@Tag(
        name = "User Controller",
        description = "User profile and account management endpoints"
)
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final GameMatchRepository gameMatchRepository;

    @Operation(
            summary = "Get user profile",
            description = "Returns profile information for authenticated user."
    )
    @GetMapping("/profile")
    public UserResponse getProfile(Authentication authentication) {

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow();

        /* FIX OLD USERS WITHOUT createdAt */
        if (user.getCreatedAt() == null) {

            user.setCreatedAt(java.time.LocalDateTime.now());

            userRepository.save(user);
        }

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
    /*@GetMapping("/profile")
    public String getProfile(org.springframework.security.core.Authentication authentication) {
        return "Welcome " + authentication.getName();
    }
    @GetMapping("/profile")
    public User getProfile(
            org.springframework.security.core.Authentication authentication
    ) {

        String username =
                authentication.getName();

        return userRepository
                .findByUsername(username)
                .orElseThrow();
    }
    */

    @GetMapping("/leaderboard")
    public List<LeaderboardResponse> getLeaderboard() {

        List<User> users = userRepository.findAll();

        return users.stream().map(user -> {

            List<GameMatch> matches =
                    gameMatchRepository.findByPlayerUsername(user.getUsername());

            int kills = matches.stream().mapToInt(GameMatch::getKills).sum();

            int wins = (int) matches.stream()
                    .filter(GameMatch::getWin)
                    .count();

            double kd = matches.stream()
                    .mapToDouble(m -> {
                        if (m.getDeaths() == 0) return m.getKills();
                        return (double) m.getKills() / m.getDeaths();
                    })
                    .average()
                    .orElse(0.0);

            return new LeaderboardResponse(
                    user.getUsername(),
                    kills,
                    wins,
                    kd
            );
        }).toList();
    }
}