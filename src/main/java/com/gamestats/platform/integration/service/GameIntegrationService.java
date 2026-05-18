package com.gamestats.platform.integration.service;

import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import com.gamestats.platform.integration.dto.CompareResponse;

public interface GameIntegrationService {

    GamePlayerStatsResponse getPlayerStats(
            String game,
            String playerName
    );
    CompareResponse comparePlayers(
            String game,
            String player1,
            String player2
    );
}