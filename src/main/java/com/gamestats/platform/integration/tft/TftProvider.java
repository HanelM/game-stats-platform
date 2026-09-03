package com.gamestats.platform.integration.tft;

import com.gamestats.platform.exception.ResourceNotFoundException;
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

        // =====================================================
        // 1. Validate Riot ID
        // =====================================================

        if (playerName == null || playerName.isBlank()) {

            throw new IllegalArgumentException(
                    "TFT Riot ID cannot be empty"
            );
        }

        String[] parts =
                playerName.split("#", 2);

        if (parts.length != 2 ||
                parts[0].isBlank() ||
                parts[1].isBlank()) {

            throw new IllegalArgumentException(
                    "TFT Riot ID must be in format GameName#TagLine"
            );
        }

        String gameName =
                parts[0].trim();

        String tagLine =
                parts[1].trim();


        // =====================================================
        // 2. Get Riot account
        // =====================================================

        RiotAccountResponse account =
                tftApiClient.getAccount(
                        gameName,
                        tagLine
                );

        if (account == null ||
                account.getPuuid() == null ||
                account.getPuuid().isBlank()) {

            throw new ResourceNotFoundException(
                    "TFT player account not found"
            );
        }


        // =====================================================
        // 3. Create response
        // =====================================================

        GamePlayerStatsResponse response =
                new GamePlayerStatsResponse();

        response.setGame(
                "Teamfight Tactics"
        );

        response.setPlayerName(
                account.getGameName() +
                        "#" +
                        account.getTagLine()
        );


        // =====================================================
        // 4. Get match history
        // =====================================================

        List<String> matchIds =
                tftApiClient.getMatchIds(
                        account.getPuuid(),
                        20
                );


        // =====================================================
        // 5. Calculate statistics
        // =====================================================

        int gamesPlayed = 0;

        int firstPlaces = 0;

        int topFour = 0;

        double totalPlacement = 0;


        // =====================================================
        // 6. Process matches
        // =====================================================

        for (String matchId : matchIds) {

            if (matchId == null ||
                    matchId.isBlank()) {

                continue;
            }

            TftMatchResponse match =
                    tftApiClient.getMatch(
                            matchId
                    );

            if (match == null ||
                    match.getInfo() == null ||
                    match.getInfo().getParticipants() == null) {

                continue;
            }


            for (TftMatchResponse.Participant participant :
                    match.getInfo().getParticipants()) {

                if (participant == null ||
                        participant.getPuuid() == null) {

                    continue;
                }

                if (account.getPuuid().equals(
                        participant.getPuuid()
                )) {

                    int placement =
                            participant.getPlacement();

                    gamesPlayed++;

                    totalPlacement += placement;


                    // 1st place
                    if (placement == 1) {

                        firstPlaces++;
                    }


                    // Top 4
                    if (placement <= 4) {

                        topFour++;
                    }

                    break;
                }
            }
        }


        // =====================================================
        // 7. Basic statistics
        // =====================================================

        response.setMatches(
                gamesPlayed
        );

        response.setWins(
                firstPlaces
        );

        response.setLosses(
                Math.max(
                        gamesPlayed - firstPlaces,
                        0
                )
        );

        response.setFirstPlaces(
                firstPlaces
        );

        response.setTopFour(
                topFour
        );


        // =====================================================
        // 8. Average placement
        // =====================================================

        response.setAveragePlacement(
                gamesPlayed > 0
                        ? totalPlacement / gamesPlayed
                        : 0
        );


        // =====================================================
        // 9. Top 4 rate
        // =====================================================

        response.setTopFourRate(
                gamesPlayed > 0
                        ? topFour * 100.0 / gamesPlayed
                        : 0
        );


        // =====================================================
        // 10. Win rate
        // =====================================================

        response.setWinRate(
                gamesPlayed > 0
                        ? firstPlaces * 100.0 / gamesPlayed
                        : 0
        );


        // =====================================================
        // 11. Return response
        // =====================================================

        return response;
    }
}