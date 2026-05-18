package com.gamestats.platform.integration.provider;

import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;

public interface GameProvider {

    String getGameName();

    GamePlayerStatsResponse getPlayerStats(
            String playerName
    );
}