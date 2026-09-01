package com.gamestats.platform.integration.provider;

import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import org.springframework.stereotype.Component;

@Component
public class FortniteProvider implements GameProvider {

    @Override
    public String getGameName() {
        return "fortnite";
    }

    @Override
    public GamePlayerStatsResponse getPlayerStats(
            String playerName
    ) {

        GamePlayerStatsResponse response =
                new GamePlayerStatsResponse();

        response.setGame("Fortnite");
        response.setPlayerName(playerName);

        return response;
    }
}