package com.gamestats.platform.integration.provider;

import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import org.springframework.stereotype.Component;

@Component
public class ValorantProvider
        implements GameProvider {

    @Override
    public String getGameName() {

        return "valorant";
    }

    @Override
    public GamePlayerStatsResponse getPlayerStats(
            String playerName
    ) {

        GamePlayerStatsResponse response =
                new GamePlayerStatsResponse();

        response.setGame("Valorant");

        response.setPlayerName(playerName);

        response.setKd(1.9);

        response.setWins(78);

        response.setKills(1840);

        response.setMatches(410);

        response.setRank("Ascendant");

        return response;
    }
}