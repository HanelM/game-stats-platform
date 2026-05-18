package com.gamestats.platform.integration.service;

import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;

public interface GameIntegrationService {

    GamePlayerStatsResponse getPlayerStats(
            String game,
            String playerName
    );
}