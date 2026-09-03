package com.gamestats.platform.integration.tft;

import com.gamestats.platform.exception.ResourceNotFoundException;
import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import com.gamestats.platform.integration.lol.dto.RiotAccountResponse;
import com.gamestats.platform.integration.provider.GameProvider;
import com.gamestats.platform.integration.tft.dto.TftMatchResponse;
import com.gamestats.platform.model.GameMatch;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TftProvider implements GameProvider {

    private final TftApiClient tftApiClient;


    // =========================================================
    // GAME NAME
    // =========================================================

    @Override
    public String getGameName() {
        return "tft";
    }


    // =========================================================
    // CONNECTION SUPPORT
    // =========================================================

    @Override
    public boolean supportsConnection() {
        return true;
    }


    // =========================================================
    // GET PLAYER STATISTICS
    // =========================================================

    @Override
    public GamePlayerStatsResponse getPlayerStats(
            String playerName
    ) {

        RiotAccountResponse account =
                getAccount(playerName);


        // -----------------------------------------------------
        // Get match IDs
        // -----------------------------------------------------

        List<String> matchIds =
                tftApiClient.getMatchIds(
                        account.getPuuid(),
                        20
                );

        if (matchIds == null) {
            matchIds = List.of();
        }


        // -----------------------------------------------------
        // Statistics
        // -----------------------------------------------------

        int gamesPlayed = 0;

        int firstPlaces = 0;

        int topFour = 0;

        double totalPlacement = 0;


        // -----------------------------------------------------
        // Process matches
        // -----------------------------------------------------

        for (String matchId : matchIds) {

            if (matchId == null ||
                    matchId.isBlank()) {
                continue;
            }


            TftMatchResponse match =
                    tftApiClient.getMatch(matchId);


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


                if (!account.getPuuid().equals(
                        participant.getPuuid()
                )) {
                    continue;
                }


                int placement =
                        participant.getPlacement();


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


        // -----------------------------------------------------
        // Calculations
        // -----------------------------------------------------

        int losses =
                Math.max(
                        gamesPlayed - firstPlaces,
                        0
                );


        double averagePlacement =
                gamesPlayed > 0
                        ? totalPlacement / gamesPlayed
                        : 0.0;


        double topFourRate =
                gamesPlayed > 0
                        ? topFour * 100.0 / gamesPlayed
                        : 0.0;


        double winRate =
                gamesPlayed > 0
                        ? firstPlaces * 100.0 / gamesPlayed
                        : 0.0;


        // -----------------------------------------------------
        // Round values
        // -----------------------------------------------------

        averagePlacement =
                Math.round(
                        averagePlacement * 100.0
                ) / 100.0;


        topFourRate =
                Math.round(
                        topFourRate * 100.0
                ) / 100.0;


        winRate =
                Math.round(
                        winRate * 100.0
                ) / 100.0;


        // -----------------------------------------------------
        // Response
        // -----------------------------------------------------

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


        response.setMatches(
                gamesPlayed
        );


        response.setWins(
                firstPlaces
        );


        response.setLosses(
                losses
        );


        response.setFirstPlaces(
                firstPlaces
        );


        response.setTopFour(
                topFour
        );


        response.setAveragePlacement(
                averagePlacement
        );


        response.setTopFourRate(
                topFourRate
        );


        response.setWinRate(
                winRate
        );


        return response;
    }


    // =========================================================
    // GET INDIVIDUAL MATCHES
    // =========================================================

    @Override
    public List<GameMatch> getMatches(
            String playerName
    ) {

        RiotAccountResponse account =
                getAccount(playerName);


        List<String> matchIds =
                tftApiClient.getMatchIds(
                        account.getPuuid(),
                        20
                );


        if (matchIds == null) {
            return List.of();
        }


        List<GameMatch> matches =
                new ArrayList<>();


        // -----------------------------------------------------
        // Process matches
        // -----------------------------------------------------

        for (String matchId : matchIds) {

            if (matchId == null ||
                    matchId.isBlank()) {
                continue;
            }


            TftMatchResponse match =
                    tftApiClient.getMatch(matchId);


            if (match == null ||
                    match.getInfo() == null ||
                    match.getInfo().getParticipants() == null) {
                continue;
            }


            // -------------------------------------------------
            // Find player
            // -------------------------------------------------

            for (TftMatchResponse.Participant participant :
                    match.getInfo().getParticipants()) {


                if (participant == null ||
                        participant.getPuuid() == null) {
                    continue;
                }


                if (!account.getPuuid().equals(
                        participant.getPuuid()
                )) {
                    continue;
                }


                // -------------------------------------------------
                // Placement
                // -------------------------------------------------

                int placement =
                        participant.getPlacement();


                // -------------------------------------------------
                // Score
                //
                // 1st = 7
                // 2nd = 6
                // ...
                // 7th = 1
                // 8th = 0
                // -------------------------------------------------

                int score =
                        Math.max(
                                0,
                                8 - placement
                        );


                // -------------------------------------------------
                // Create GameMatch
                // -------------------------------------------------

                GameMatch gameMatch =
                        GameMatch.builder()

                                .gameName(
                                        "Teamfight Tactics"
                                )

                                .score(
                                        score
                                )

                                .placement(
                                        placement
                                )

                                .win(
                                        placement == 1
                                )

                                /*
                                 * Imported from Riot API.
                                 */
                                .source(
                                        "API"
                                )

                                /*
                                 * Riot ID used to connect.
                                 */
                                .connectedAccount(
                                        account.getGameName() +
                                                "#" +
                                                account.getTagLine()
                                )

                                /*
                                 * Riot match ID.
                                 */
                                .externalMatchId(
                                        matchId
                                )

                                .platform(
                                        "EUW1"
                                )

                                .playedAt(
                                        LocalDateTime.now()
                                )

                                .build();


                matches.add(gameMatch);

                break;
            }
        }


        return matches;
    }


    // =========================================================
    // GET RIOT ACCOUNT
    // =========================================================

    private RiotAccountResponse getAccount(
            String playerName
    ) {

        if (playerName == null ||
                playerName.isBlank()) {

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


        return account;
    }
}