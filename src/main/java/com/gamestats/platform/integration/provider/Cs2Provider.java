package com.gamestats.platform.integration.provider;

import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import org.springframework.stereotype.Component;

@Component
public class Cs2Provider implements GameProvider {

    @Override
    public String getGameName() {
        return "cs2";
    }

    @Override
    public GamePlayerStatsResponse getPlayerStats(String playerName) {
        GamePlayerStatsResponse response = new GamePlayerStatsResponse();
        response.setGame("CS2");
        response.setPlayerName(playerName);
        return response;
    }
}