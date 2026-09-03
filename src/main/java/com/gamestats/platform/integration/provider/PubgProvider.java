package com.gamestats.platform.integration.provider;

import com.gamestats.platform.exception.ResourceNotFoundException;
import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import com.gamestats.platform.integration.pubg.dto.PubgMatchData;
import com.gamestats.platform.integration.pubg.dto.PubgMatchIncluded;
import com.gamestats.platform.integration.pubg.dto.PubgMatchResponse;
import com.gamestats.platform.integration.pubg.dto.PubgPlayerData;
import com.gamestats.platform.integration.pubg.dto.PubgPlayerResponse;
import com.gamestats.platform.integration.pubg.dto.PubgStats;
import com.gamestats.platform.model.GameMatch;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PubgProvider implements GameProvider {

    private final WebClient webClient;

    @Value("${pubg.api.key}")
    private String apiKey;


    /*
     * ============================================================
     * CONSTANTS
     * ============================================================
     */

    private static final String PUBG_BASE_URL =
            "https://api.pubg.com/shards/steam";

    private static final String PUBG_ACCEPT =
            "application/vnd.api+json";

    private static final int MAX_MATCHES =
            20;

    private static final int MAX_RETRIES =
            3;

    private static final long RETRY_DELAY_MS =
            1500;

    private static final long MATCH_REQUEST_DELAY_MS =
            150;


    /*
     * ============================================================
     * GAME NAME
     * ============================================================
     */

    @Override
    public String getGameName() {
        return "pubg";
    }


    /*
     * ============================================================
     * GET PLAYER STATISTICS
     *
     * IMPORTANT:
     * This method now gets LIVE data from PUBG.
     *
     * We intentionally do NOT use the old PlayerStats
     * database cache here because it can make testing
     * reconnect/disconnect confusing.
     * ============================================================
     */

    @Override
    public GamePlayerStatsResponse getPlayerStats(
            String playerName
    ) {

        if (
                playerName == null ||
                        playerName.isBlank()
        ) {

            throw new IllegalArgumentException(
                    "PUBG player name cannot be empty"
            );
        }

        playerName =
                playerName.trim();


        System.out.println();
        System.out.println(
                "========================================"
        );
        System.out.println(
                "PUBG LIVE PLAYER STATISTICS"
        );
        System.out.println(
                "Player: " + playerName
        );
        System.out.println(
                "========================================"
        );


        /*
         * --------------------------------------------------------
         * GET PLAYER
         * --------------------------------------------------------
         */

        PubgPlayerResponse response =
                getPlayerResponse(
                        playerName
                );


        /*
         * --------------------------------------------------------
         * VALIDATE PLAYER
         * --------------------------------------------------------
         */

        if (
                response == null ||
                        response.getData() == null ||
                        response.getData().isEmpty()
        ) {

            throw new ResourceNotFoundException(
                    "PUBG player not found: "
                            + playerName
            );
        }


        PubgPlayerData player =
                response.getData().get(0);


        if (player == null) {

            throw new ResourceNotFoundException(
                    "PUBG player data is empty"
            );
        }


        if (
                player.getAttributes() == null
        ) {

            throw new ResourceNotFoundException(
                    "PUBG player attributes are missing"
            );
        }


        String pubgPlayerName =
                player.getAttributes().getName();


        if (
                pubgPlayerName == null ||
                        pubgPlayerName.isBlank()
        ) {

            throw new ResourceNotFoundException(
                    "PUBG player name is missing"
            );
        }


        System.out.println(
                "PUBG PLAYER FOUND: "
                        + pubgPlayerName
        );


        /*
         * --------------------------------------------------------
         * STATISTICS
         * --------------------------------------------------------
         */

        int totalKills = 0;
        int totalWins = 0;
        int totalMatches = 0;

        double totalDamage = 0;
        double totalSurvivalTime = 0;


        /*
         * --------------------------------------------------------
         * GET MATCH IDS
         * --------------------------------------------------------
         */

        List<String> matchIds =
                getPlayerMatchIds(
                        player
                );


        System.out.println(
                "PUBG MATCH IDS FOUND: "
                        + matchIds.size()
        );


        /*
         * --------------------------------------------------------
         * PROCESS MATCHES
         * --------------------------------------------------------
         */

        for (String matchId : matchIds) {

            try {

                PubgMatchResponse matchResponse =
                        getMatchResponse(
                                matchId
                        );


                if (
                        matchResponse == null
                ) {

                    System.out.println(
                            "EMPTY MATCH RESPONSE: "
                                    + matchId
                    );

                    continue;
                }


                if (
                        matchResponse.getIncluded() == null ||
                                matchResponse
                                        .getIncluded()
                                        .isEmpty()
                ) {

                    System.out.println(
                            "MATCH HAS NO INCLUDED DATA: "
                                    + matchId
                    );

                    continue;
                }


                PubgStats stats =
                        findPlayerStatsInMatch(
                                matchResponse,
                                pubgPlayerName
                        );


                if (stats == null) {

                    System.out.println(
                            "PLAYER NOT FOUND INSIDE MATCH: "
                                    + matchId
                    );

                    continue;
                }


                int kills =
                        stats.getKills() != null
                                ? stats.getKills()
                                : 0;


                double damage =
                        stats.getDamageDealt() != null
                                ? stats.getDamageDealt()
                                : 0.0;


                double survivalTime =
                        stats.getTimeSurvived() != null
                                ? stats.getTimeSurvived()
                                : 0.0;


                boolean win =
                        stats.getWinPlace() != null &&
                                stats.getWinPlace() == 1;


                totalKills +=
                        kills;

                totalDamage +=
                        damage;

                totalSurvivalTime +=
                        survivalTime;

                totalMatches++;


                if (win) {
                    totalWins++;
                }


                System.out.println(
                        "PLAYER FOUND IN MATCH: "
                                + matchId
                );

                System.out.println(
                        "Kills: "
                                + kills
                );

                System.out.println(
                        "Damage: "
                                + damage
                );

                System.out.println(
                        "Placement: "
                                + stats.getWinPlace()
                );


                /*
                 * Small delay between requests.
                 */

                sleep(
                        MATCH_REQUEST_DELAY_MS
                );

            } catch (Exception e) {

                System.out.println(
                        "ERROR PROCESSING PUBG MATCH: "
                                + matchId
                );

                System.out.println(
                        "Reason: "
                                + e.getMessage()
                );
            }
        }


        /*
         * --------------------------------------------------------
         * CALCULATE
         * --------------------------------------------------------
         */

        double kd =
                totalMatches > 0
                        ? (double) totalKills / totalMatches
                        : 0.0;


        double averageDamage =
                totalMatches > 0
                        ? totalDamage / totalMatches
                        : 0.0;


        double averageSurvivalTime =
                totalMatches > 0
                        ? totalSurvivalTime / totalMatches
                        : 0.0;


        /*
         * --------------------------------------------------------
         * RESPONSE
         * --------------------------------------------------------
         */

        GamePlayerStatsResponse stats =
                new GamePlayerStatsResponse();


        stats.setGame(
                "PUBG"
        );

        stats.setPlayerName(
                pubgPlayerName
        );

        stats.setKd(
                Math.round(kd * 100.0) / 100.0
        );

        stats.setWins(
                totalWins
        );

        stats.setKills(
                totalKills
        );

        stats.setMatches(
                totalMatches
        );

        stats.setAverageDamage(
                Math.round(
                        averageDamage * 100.0
                ) / 100.0
        );

        stats.setAverageSurvivalTime(
                Math.round(
                        averageSurvivalTime * 100.0
                ) / 100.0
        );

        stats.setRank(
                "Live PUBG Data"
        );


        /*
         * --------------------------------------------------------
         * LOG
         * --------------------------------------------------------
         */

        System.out.println();
        System.out.println(
                "========================================"
        );

        System.out.println(
                "PUBG LIVE STATISTICS FINISHED"
        );

        System.out.println(
                "Player: "
                        + pubgPlayerName
        );

        System.out.println(
                "Matches: "
                        + totalMatches
        );

        System.out.println(
                "Kills: "
                        + totalKills
        );

        System.out.println(
                "Wins: "
                        + totalWins
        );

        System.out.println(
                "K/D: "
                        + stats.getKd()
        );

        System.out.println(
                "Average Damage: "
                        + stats.getAverageDamage()
        );

        System.out.println(
                "========================================"
        );


        return stats;
    }


    /*
     * ============================================================
     * IMPORT PUBG MATCHES
     * ============================================================
     */

    @Override
    public List<GameMatch> getMatches(
            String playerName
    ) {

        List<GameMatch> matches =
                new ArrayList<>();


        if (
                playerName == null ||
                        playerName.isBlank()
        ) {

            throw new IllegalArgumentException(
                    "PUBG player name cannot be empty"
            );
        }


        playerName =
                playerName.trim();


        System.out.println();
        System.out.println(
                "========================================"
        );

        System.out.println(
                "PUBG MATCH IMPORT"
        );

        System.out.println(
                "Player: "
                        + playerName
        );

        System.out.println(
                "========================================"
        );


        /*
         * --------------------------------------------------------
         * GET PLAYER
         * --------------------------------------------------------
         */

        PubgPlayerResponse response =
                getPlayerResponse(
                        playerName
                );


        /*
         * --------------------------------------------------------
         * VALIDATE
         * --------------------------------------------------------
         */

        if (
                response == null ||
                        response.getData() == null ||
                        response.getData().isEmpty()
        ) {

            throw new ResourceNotFoundException(
                    "PUBG player not found: "
                            + playerName
            );
        }


        PubgPlayerData player =
                response.getData().get(0);


        if (player == null) {

            throw new ResourceNotFoundException(
                    "PUBG player data is empty"
            );
        }


        if (
                player.getAttributes() == null
        ) {

            throw new ResourceNotFoundException(
                    "PUBG player attributes are missing"
            );
        }


        String pubgPlayerName =
                player.getAttributes().getName();


        if (
                pubgPlayerName == null ||
                        pubgPlayerName.isBlank()
        ) {

            throw new ResourceNotFoundException(
                    "PUBG player name is missing"
            );
        }


        System.out.println(
                "PUBG PLAYER FOUND"
        );

        System.out.println(
                "Player ID: "
                        + player.getId()
        );

        System.out.println(
                "Player Name: "
                        + pubgPlayerName
        );


        /*
         * --------------------------------------------------------
         * GET MATCH IDS
         * --------------------------------------------------------
         */

        List<String> matchIds =
                getPlayerMatchIds(
                        player
                );


        System.out.println(
                "PUBG MATCH IDS FOUND: "
                        + matchIds.size()
        );


        if (matchIds.isEmpty()) {

            System.out.println(
                    "PUBG RETURNED ZERO RECENT MATCH IDS"
            );

            return matches;
        }


        /*
         * --------------------------------------------------------
         * PROCESS EACH MATCH
         * --------------------------------------------------------
         */

        int failedMatches = 0;


        for (String matchId : matchIds) {

            try {

                System.out.println();
                System.out.println(
                        "Loading PUBG match: "
                                + matchId
                );


                PubgMatchResponse matchResponse =
                        getMatchResponse(
                                matchId
                        );


                if (
                        matchResponse == null
                ) {

                    failedMatches++;

                    System.out.println(
                            "EMPTY MATCH RESPONSE: "
                                    + matchId
                    );

                    continue;
                }


                if (
                        matchResponse.getIncluded() == null ||
                                matchResponse
                                        .getIncluded()
                                        .isEmpty()
                ) {

                    failedMatches++;

                    System.out.println(
                            "MATCH HAS NO INCLUDED DATA: "
                                    + matchId
                    );

                    continue;
                }


                PubgStats stats =
                        findPlayerStatsInMatch(
                                matchResponse,
                                pubgPlayerName
                        );


                if (stats == null) {

                    failedMatches++;

                    System.out.println(
                            "PLAYER NOT FOUND INSIDE MATCH: "
                                    + matchId
                    );

                    continue;
                }


                /*
                 * ------------------------------------------------
                 * EXTRACT
                 * ------------------------------------------------
                 */

                int kills =
                        stats.getKills() != null
                                ? stats.getKills()
                                : 0;


                int damage =
                        stats.getDamageDealt() != null
                                ? stats.getDamageDealt().intValue()
                                : 0;


                int placement =
                        stats.getWinPlace() != null
                                ? stats.getWinPlace()
                                : 0;


                String survivalTime =
                        stats.getTimeSurvived() != null
                                ? String.valueOf(
                                stats.getTimeSurvived()
                        )
                                : "0";


                boolean win =
                        stats.getWinPlace() != null &&
                                stats.getWinPlace() == 1;


                /*
                 * ------------------------------------------------
                 * CREATE GAME MATCH
                 * ------------------------------------------------
                 */

                GameMatch gameMatch =
                        GameMatch.builder()

                                .gameName(
                                        "PUBG"
                                )

                                .kills(
                                        kills
                                )

                                .damage(
                                        damage
                                )

                                .survivalTime(
                                        survivalTime
                                )

                                .placement(
                                        placement
                                )

                                .win(
                                        win
                                )

                                .source(
                                        "API"
                                )

                                .connectedAccount(
                                        pubgPlayerName
                                )

                                .externalMatchId(
                                        matchId
                                )

                                .platform(
                                        "STEAM"
                                )

                                .playedAt(
                                        LocalDateTime.now()
                                )

                                .build();


                matches.add(
                        gameMatch
                );


                System.out.println(
                        "SUCCESSFULLY IMPORTED MATCH: "
                                + matchId
                );

                System.out.println(
                        "Kills: "
                                + kills
                );

                System.out.println(
                        "Damage: "
                                + damage
                );

                System.out.println(
                        "Placement: "
                                + placement
                );

                System.out.println(
                        "Win: "
                                + win
                );


                /*
                 * ------------------------------------------------
                 * DELAY
                 * ------------------------------------------------
                 */

                sleep(
                        MATCH_REQUEST_DELAY_MS
                );


            } catch (Exception e) {

                failedMatches++;

                System.out.println();
                System.out.println(
                        "FAILED PUBG MATCH: "
                                + matchId
                );

                System.out.println(
                        "Reason: "
                                + e.getMessage()
                );
            }
        }


        /*
         * --------------------------------------------------------
         * FINAL RESULT
         * --------------------------------------------------------
         */

        System.out.println();
        System.out.println(
                "========================================"
        );

        System.out.println(
                "PUBG MATCH IMPORT FINISHED"
        );

        System.out.println(
                "Player: "
                        + pubgPlayerName
        );

        System.out.println(
                "Match IDs received: "
                        + matchIds.size()
        );

        System.out.println(
                "Successfully imported: "
                        + matches.size()
        );

        System.out.println(
                "Failed/skipped: "
                        + failedMatches
        );

        System.out.println(
                "========================================"
        );


        /*
         * If PUBG returned match IDs but absolutely
         * none could be loaded, report this clearly.
         */

        if (
                !matchIds.isEmpty() &&
                        matches.isEmpty()
        ) {

            throw new RuntimeException(
                    "PUBG returned "
                            + matchIds.size()
                            + " match IDs, but none of the "
                            + "match details could be loaded."
                            + " Check PUBG API rate limits "
                            + "or match availability."
            );
        }


        return matches;
    }


    /*
     * ============================================================
     * GET PLAYER RESPONSE
     * ============================================================
     */

    private PubgPlayerResponse getPlayerResponse(
            String playerName
    ) {

        String encodedPlayerName =
                URLEncoder
                        .encode(
                                playerName,
                                StandardCharsets.UTF_8
                        )
                        .replace(
                                "+",
                                "%20"
                        );


        String uri =
                PUBG_BASE_URL
                        + "/players?filter[playerNames]="
                        + encodedPlayerName;


        return executeWithRetry(
                () ->
                        webClient.get()
                                .uri(uri)
                                .header(
                                        "Authorization",
                                        "Bearer " + apiKey
                                )
                                .header(
                                        "Accept",
                                        PUBG_ACCEPT
                                )
                                .retrieve()
                                .bodyToMono(
                                        PubgPlayerResponse.class
                                )
                                .block()
        );
    }


    /*
     * ============================================================
     * GET PLAYER MATCH IDS
     * ============================================================
     */

    private List<String> getPlayerMatchIds(
            PubgPlayerData player
    ) {

        List<String> matchIds =
                new ArrayList<>();


        if (
                player.getRelationships() == null
        ) {

            System.out.println(
                    "PUBG PLAYER HAS NO RELATIONSHIPS"
            );

            return matchIds;
        }


        if (
                player.getRelationships()
                        .getMatches() == null
        ) {

            System.out.println(
                    "PUBG PLAYER HAS NO MATCH RELATIONSHIP"
            );

            return matchIds;
        }


        if (
                player.getRelationships()
                        .getMatches()
                        .getData() == null
        ) {

            System.out.println(
                    "PUBG PLAYER HAS NO MATCH DATA"
            );

            return matchIds;
        }


        matchIds =
                player.getRelationships()
                        .getMatches()
                        .getData()
                        .stream()

                        .filter(
                                match ->
                                        match != null &&
                                                match.getId() != null &&
                                                !match.getId().isBlank()
                        )

                        .limit(
                                MAX_MATCHES
                        )

                        .map(
                                PubgMatchData::getId
                        )

                        .toList();


        return matchIds;
    }


    /*
     * ============================================================
     * GET INDIVIDUAL MATCH
     * ============================================================
     */

    private PubgMatchResponse getMatchResponse(
            String matchId
    ) {

        String uri =
                PUBG_BASE_URL
                        + "/matches/"
                        + matchId;


        return executeWithRetry(
                () ->
                        webClient.get()
                                .uri(uri)
                                .header(
                                        "Authorization",
                                        "Bearer " + apiKey
                                )
                                .header(
                                        "Accept",
                                        PUBG_ACCEPT
                                )
                                .retrieve()
                                .bodyToMono(
                                        PubgMatchResponse.class
                                )
                                .block()
        );
    }


    /*
     * ============================================================
     * FIND PLAYER IN MATCH
     * ============================================================
     */

    private PubgStats findPlayerStatsInMatch(
            PubgMatchResponse matchResponse,
            String playerName
    ) {

        if (
                matchResponse == null ||
                        matchResponse.getIncluded() == null
        ) {

            return null;
        }


        for (
                PubgMatchIncluded included
                : matchResponse.getIncluded()
        ) {

            if (included == null) {
                continue;
            }


            if (
                    included.getAttributes() == null
            ) {

                continue;
            }


            if (
                    included.getAttributes()
                            .getStats() == null
            ) {

                continue;
            }


            PubgStats stats =
                    included
                            .getAttributes()
                            .getStats();


            if (
                    stats.getName() == null
            ) {

                continue;
            }


            if (
                    stats.getName()
                            .equalsIgnoreCase(
                                    playerName
                            )
            ) {

                return stats;
            }
        }


        return null;
    }


    /*
     * ============================================================
     * RETRY WEB REQUEST
     * ============================================================
     */

    private <T> T executeWithRetry(
            ApiCall<T> apiCall
    ) {

        Exception lastException =
                null;


        for (
                int attempt = 1;
                attempt <= MAX_RETRIES;
                attempt++
        ) {

            try {

                return apiCall.execute();

            } catch (
                    WebClientResponseException e
            ) {

                lastException =
                        e;


                int status =
                        e.getStatusCode()
                                .value();


                System.out.println(
                        "PUBG API HTTP ERROR: "
                                + status
                );


                /*
                 * Retry rate limiting and
                 * temporary server errors.
                 */

                boolean retryable =
                        status == 429 ||
                                status == 500 ||
                                status == 502 ||
                                status == 503 ||
                                status == 504;


                if (
                        !retryable ||
                                attempt == MAX_RETRIES
                ) {

                    throw e;
                }


                System.out.println(
                        "PUBG API temporary error."
                );

                System.out.println(
                        "Retry "
                                + attempt
                                + "/"
                                + MAX_RETRIES
                );


                sleep(
                        RETRY_DELAY_MS * attempt
                );


            } catch (Exception e) {

                lastException =
                        e;


                if (
                        attempt ==
                                MAX_RETRIES
                ) {

                    throw new RuntimeException(
                            "PUBG API request failed",
                            e
                    );
                }


                System.out.println(
                        "PUBG API request failed."
                );

                System.out.println(
                        "Retry "
                                + attempt
                                + "/"
                                + MAX_RETRIES
                );


                sleep(
                        RETRY_DELAY_MS * attempt
                );
            }
        }


        throw new RuntimeException(
                "PUBG API request failed",
                lastException
        );
    }


    /*
     * ============================================================
     * SLEEP
     * ============================================================
     */

    private void sleep(
            long milliseconds
    ) {

        try {

            Thread.sleep(
                    milliseconds
            );

        } catch (
                InterruptedException e
        ) {

            Thread.currentThread()
                    .interrupt();

            throw new RuntimeException(
                    "PUBG request interrupted",
                    e
            );
        }
    }


    /*
     * ============================================================
     * API CALL FUNCTION
     * ============================================================
     */

    @FunctionalInterface
    private interface ApiCall<T> {

        T execute();
    }


    /*
     * ============================================================
     * CONNECTION SUPPORT
     * ============================================================
     */

    @Override
    public boolean supportsConnection() {
        return true;
    }
}