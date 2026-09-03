package com.gamestats.platform.integration.provider;

import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import com.gamestats.platform.model.GameMatch;

import java.util.Collections;
import java.util.List;

public interface GameProvider {

    String getGameName();

    GamePlayerStatsResponse getPlayerStats(String playerName);

    default boolean supportsConnection() {
        return false;
    }

    default List<GameMatch> getMatches(String playerName) {
        return Collections.emptyList();
    }
}