package com.gamestats.platform.integration.provider;

import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import org.springframework.stereotype.Component;

@Component
public class LeagueOfLegendsProvider implements GameProvider {

    @Override
    public String getGameName() {
        return "leagueoflegends";
    }

    @Override
    public GamePlayerStatsResponse getPlayerStats(
            String playerName
    ) {

        GamePlayerStatsResponse response =
                new GamePlayerStatsResponse();

        response.setGame("League of Legends");
        response.setPlayerName(playerName);

        return response;
    }
}