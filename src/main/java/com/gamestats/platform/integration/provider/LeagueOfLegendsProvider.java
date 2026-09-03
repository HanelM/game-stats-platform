package com.gamestats.platform.integration.provider;

import com.gamestats.platform.exception.ResourceNotFoundException;
import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import com.gamestats.platform.integration.lol.RiotApiClient;
import com.gamestats.platform.integration.lol.dto.LeagueSummonerResponse;
import com.gamestats.platform.integration.lol.dto.RiotAccountResponse;
import com.gamestats.platform.integration.lol.dto.RiotMatchResponse;
import com.gamestats.platform.model.GameMatch;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class LeagueOfLegendsProvider implements GameProvider {

    private final RiotApiClient riotApiClient;


    // =========================================================
    // GAME NAME
    // =========================================================

    @Override
    public String getGameName() {
        return "leagueoflegends";
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

        String puuid =
                account.getPuuid();


        // -----------------------------------------------------
        // Get summoner
        // -----------------------------------------------------

        LeagueSummonerResponse summoner =
                riotApiClient.getSummoner(puuid);

        if (summoner == null) {

            throw new ResourceNotFoundException(
                    "League of Legends summoner not found"
            );
        }


        // -----------------------------------------------------
        // Get matches
        // -----------------------------------------------------

        List<String> matchIds =
                riotApiClient.getMatchIds(
                        puuid,
                        20
                );

        if (matchIds == null) {
            matchIds = List.of();
        }


        // -----------------------------------------------------
        // Statistics
        // -----------------------------------------------------

        int matches = 0;
        int wins = 0;
        int kills = 0;
        int deaths = 0;
        int assists = 0;

        long totalDamage = 0;
        long totalGameDuration = 0;


        // -----------------------------------------------------
        // Process matches
        // -----------------------------------------------------

        for (String matchId : matchIds) {

            if (matchId == null ||
                    matchId.isBlank()) {
                continue;
            }

            RiotMatchResponse match =
                    riotApiClient.getMatch(matchId);

            if (match == null ||
                    match.getInfo() == null ||
                    match.getInfo().getParticipants() == null) {
                continue;
            }


            RiotMatchResponse.Participant player =
                    match.getInfo()
                            .getParticipants()
                            .stream()
                            .filter(participant ->
                                    participant != null &&
                                            puuid.equals(
                                                    participant.getPuuid()
                                            )
                            )
                            .findFirst()
                            .orElse(null);

            if (player == null) {
                continue;
            }


            matches++;

            kills += player.getKills();

            deaths += player.getDeaths();

            assists += player.getAssists();

            totalDamage +=
                    player.getTotalDamageDealtToChampions();

            totalGameDuration +=
                    match.getInfo().getGameDuration();


            if (player.isWin()) {
                wins++;
            }
        }


        // -----------------------------------------------------
        // Calculations
        // -----------------------------------------------------

        int losses =
                Math.max(
                        matches - wins,
                        0
                );

        double winRate =
                matches > 0
                        ? ((double) wins / matches) * 100.0
                        : 0.0;

        double kd =
                deaths > 0
                        ? (double) kills / deaths
                        : kills;

        double averageKda =
                deaths > 0
                        ? (double) (kills + assists) / deaths
                        : kills + assists;

        double averageDamage =
                matches > 0
                        ? (double) totalDamage / matches
                        : 0.0;

        double averageSurvivalTime =
                matches > 0
                        ? ((double) totalGameDuration / matches) / 60.0
                        : 0.0;


        // -----------------------------------------------------
        // Round values
        // -----------------------------------------------------

        kd =
                Math.round(kd * 100.0) / 100.0;

        winRate =
                Math.round(winRate * 100.0) / 100.0;

        averageKda =
                Math.round(averageKda * 100.0) / 100.0;

        averageDamage =
                Math.round(averageDamage * 100.0) / 100.0;

        averageSurvivalTime =
                Math.round(averageSurvivalTime * 100.0) / 100.0;


        // -----------------------------------------------------
        // Response
        // -----------------------------------------------------

        GamePlayerStatsResponse response =
                new GamePlayerStatsResponse();

        response.setGame(
                "League of Legends"
        );

        response.setPlayerName(
                account.getGameName() +
                        "#" +
                        account.getTagLine()
        );

        response.setKd(kd);

        response.setWins(wins);

        response.setLosses(losses);

        response.setWinRate(winRate);

        response.setKills(kills);

        response.setDeaths(deaths);

        response.setAssists(assists);

        response.setMatches(matches);

        response.setAverageKda(averageKda);

        response.setAverageDamage(averageDamage);

        response.setAverageSurvivalTime(
                averageSurvivalTime
        );

        response.setRank(
                "Summoner Level " +
                        summoner.getSummonerLevel()
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

        String puuid =
                account.getPuuid();


        // -----------------------------------------------------
        // Get match IDs
        // -----------------------------------------------------

        List<String> matchIds =
                riotApiClient.getMatchIds(
                        puuid,
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


            RiotMatchResponse match =
                    riotApiClient.getMatch(matchId);


            if (match == null ||
                    match.getInfo() == null ||
                    match.getInfo().getParticipants() == null) {
                continue;
            }


            RiotMatchResponse.Participant player =
                    match.getInfo()
                            .getParticipants()
                            .stream()
                            .filter(participant ->
                                    participant != null &&
                                            puuid.equals(
                                                    participant.getPuuid()
                                            )
                            )
                            .findFirst()
                            .orElse(null);


            if (player == null) {
                continue;
            }


            // -------------------------------------------------
            // Create GameMatch
            // -------------------------------------------------

            GameMatch gameMatch =
                    GameMatch.builder()

                            .gameName(
                                    "League of Legends"
                            )

                            /*
                             * Simple score used by the
                             * leaderboard / best matches.
                             */
                            .score(
                                    player.getKills() +
                                            player.getAssists()
                            )

                            .kills(
                                    player.getKills()
                            )

                            .deaths(
                                    player.getDeaths()
                            )

                            .assists(
                                    player.getAssists()
                            )

                            .damage(
                                    player.getTotalDamageDealtToChampions()
                            )

                            .win(
                                    player.isWin()
                            )

                            /*
                             * This is an API/imported match.
                             */
                            .source(
                                    "API"
                            )

                            /*
                             * Riot ID used to connect
                             * the account.
                             */
                            .connectedAccount(
                                    account.getGameName() +
                                            "#" +
                                            account.getTagLine()
                            )

                            /*
                             * Riot's match ID.
                             */
                            .externalMatchId(
                                    matchId
                            )

                            /*
                             * Current implementation uses
                             * EUW1 as the platform.
                             */
                            .platform(
                                    "EUW1"
                            )

                            .playedAt(
                                    LocalDateTime.now()
                            )

                            .build();


            matches.add(gameMatch);
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
                    "League of Legends Riot ID cannot be empty"
            );
        }


        String[] parts =
                playerName.split("#", 2);


        if (parts.length != 2 ||
                parts[0].isBlank() ||
                parts[1].isBlank()) {

            throw new IllegalArgumentException(
                    "Riot ID must be in format GameName#TagLine"
            );
        }


        String gameName =
                parts[0].trim();

        String tagLine =
                parts[1].trim();


        RiotAccountResponse account =
                riotApiClient.getAccount(
                        gameName,
                        tagLine
                );


        if (account == null ||
                account.getPuuid() == null ||
                account.getPuuid().isBlank()) {

            throw new ResourceNotFoundException(
                    "League of Legends player not found"
            );
        }


        return account;
    }
}