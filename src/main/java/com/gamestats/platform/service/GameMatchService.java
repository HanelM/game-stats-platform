package com.gamestats.platform.service;

import com.gamestats.platform.dto.GameMatchRequest;
import com.gamestats.platform.dto.MatchStatsResponse;
import com.gamestats.platform.model.GameMatch;

import java.util.List;

public interface GameMatchService {

    GameMatch saveMatch(
            GameMatchRequest request,
            String username
    );

    List<GameMatch> getPlayerMatches(String username);

    MatchStatsResponse getPlayerStats(String username);
}