package com.gamestats.platform.integration.provider;

import com.gamestats.platform.exception.ResourceNotFoundException;
import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import com.gamestats.platform.integration.lol.RiotApiClient;
import com.gamestats.platform.integration.lol.dto.LeagueSummonerResponse;
import com.gamestats.platform.integration.lol.dto.LolLeagueEntryResponse;
import com.gamestats.platform.integration.lol.dto.RiotAccountResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class LeagueOfLegendsProvider implements GameProvider {

    private final RiotApiClient riotApiClient;

    @Override
    public String getGameName() {
        return "leagueoflegends";
    }

    @Override
    public GamePlayerStatsResponse getPlayerStats(String playerName) {

        String[] parts = playerName.split("#", 2);

        if (parts.length != 2) {
            throw new IllegalArgumentException(
                    "Riot ID must be in format GameName#TagLine"
            );
        }

        String gameName = parts[0];
        String tagLine = parts[1];

        // 1. Get Riot account
        RiotAccountResponse account =
                riotApiClient.getAccount(
                        gameName,
                        tagLine
                );

        if (account == null || account.getPuuid() == null) {
            throw new ResourceNotFoundException(
                    "League of Legends player not found"
            );
        }

        // 2. Get LoL summoner
        LeagueSummonerResponse summoner =
                riotApiClient.getSummoner(
                        account.getPuuid()
                );

        if (summoner == null) {
            throw new ResourceNotFoundException(
                    "League of Legends summoner not found"
            );
        }



        // 5. Create response
        GamePlayerStatsResponse response =
                new GamePlayerStatsResponse();

        response.setGame("League of Legends");

        response.setPlayerName(
                gameName + "#" + tagLine
        );

        response.setKd(0);

        response.setKills(0);

        response.setMatches(0);

        response.setAverageDamage(0);

        response.setAverageSurvivalTime(0);



        return response;
    }
}