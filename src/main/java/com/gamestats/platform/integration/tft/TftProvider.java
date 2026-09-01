package com.gamestats.platform.integration.tft;

import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import com.gamestats.platform.integration.lol.dto.RiotAccountResponse;
import com.gamestats.platform.integration.provider.GameProvider;
import com.gamestats.platform.integration.tft.dto.TftMatchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TftProvider implements GameProvider {

    private final TftApiClient tftApiClient;

    @Override
    public String getGameName() {
        return "tft";
    }

    @Override
    public GamePlayerStatsResponse getPlayerStats(String playerName) {

        String gameName = playerName;

        if (gameName == null || gameName.isBlank()) {
            throw new IllegalArgumentException(
                    "TFT player name cannot be empty"
            );
        }

        String tagLine = "EUW";

        RiotAccountResponse account =
                tftApiClient.getAccount(gameName, tagLine);

        if (account == null || account.getPuuid() == null) {

            throw new IllegalArgumentException(
                    "TFT player account not found"
            );
        }

        GamePlayerStatsResponse response =
                new GamePlayerStatsResponse();

        response.setGame("Teamfight Tactics");

        response.setPlayerName(account.getGameName());

        List<String> matchIds =
                tftApiClient.getMatchIds(
                        account.getPuuid(),
                        20
                );

        int gamesPlayed = 0;
        int firstPlaces = 0;
        int topFour = 0;
        double totalPlacement = 0;

        for (String matchId : matchIds) {

            TftMatchResponse match =
                    tftApiClient.getMatch(matchId);

            if (match == null ||
                    match.getInfo() == null ||
                    match.getInfo().getParticipants() == null) {

                continue;
            }

            for (TftMatchResponse.Participant participant :
                    match.getInfo().getParticipants()) {

                if (account.getPuuid().equals(
                        participant.getPuuid())) {

                    int placement = participant.getPlacement();

                    gamesPlayed++;
                    totalPlacement += placement;

                    if (placement == 1) {
                        firstPlaces++;
                    }

                    if (placement <= 4) {
                        topFour++;
                    }

                    break;
                }
            }
        }

        response.setMatches(gamesPlayed);
        response.setWins(firstPlaces);

        response.setLosses(
                Math.max(gamesPlayed - firstPlaces, 0)
        );

        response.setAveragePlacement(
                gamesPlayed > 0
                        ? totalPlacement / gamesPlayed
                        : 0
        );

        response.setFirstPlaces(firstPlaces);
        response.setTopFour(topFour);

        response.setTopFourRate(
                gamesPlayed > 0
                        ? topFour * 100.0 / gamesPlayed
                        : 0
        );

        response.setWinRate(
                gamesPlayed > 0
                        ? firstPlaces * 100.0 / gamesPlayed
                        : 0
        );

        return response;
    }
}

