package com.gamestats.platform.integration.provider;

import com.gamestats.platform.exception.ResourceNotFoundException;
import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import com.gamestats.platform.integration.lol.RiotApiClient;
import com.gamestats.platform.integration.lol.dto.LeagueSummonerResponse;
import com.gamestats.platform.integration.lol.dto.RiotAccountResponse;
import com.gamestats.platform.integration.lol.dto.RiotMatchResponse;
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
    public GamePlayerStatsResponse getPlayerStats(
            String playerName
    ) {

        // =====================================================
        // 1. Validate Riot ID
        // =====================================================

        if (playerName == null || playerName.isBlank()) {
            throw new IllegalArgumentException(
                    "Riot ID cannot be empty"
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

        String gameName = parts[0].trim();
        String tagLine = parts[1].trim();


        // =====================================================
        // 2. Get Riot account
        // =====================================================

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

        String puuid =
                account.getPuuid();


        // =====================================================
        // 3. Get League of Legends summoner
        // =====================================================

        LeagueSummonerResponse summoner =
                riotApiClient.getSummoner(
                        puuid
                );

        if (summoner == null) {

            throw new ResourceNotFoundException(
                    "League of Legends summoner not found"
            );
        }


        // =====================================================
        // 4. Get recent match IDs
        // =====================================================

        List<String> matchIds =
                riotApiClient.getMatchIds(
                        puuid,
                        20
                );

        if (matchIds == null) {
            matchIds = List.of();
        }


        // =====================================================
        // 5. Initialize statistics
        // =====================================================

        int matches = 0;
        int wins = 0;
        int kills = 0;
        int deaths = 0;

        long totalDamage = 0;


        // =====================================================
        // 6. Get every match
        // =====================================================

        for (String matchId : matchIds) {

            if (matchId == null || matchId.isBlank()) {
                continue;
            }

            RiotMatchResponse match =
                    riotApiClient.getMatch(
                            matchId
                    );

            if (match == null ||
                    match.getInfo() == null ||
                    match.getInfo().getParticipants() == null) {

                continue;
            }


            // =================================================
            // Find the requested player
            // =================================================

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


            // =================================================
            // Add match statistics
            // =================================================

            matches++;

            kills += player.getKills();

            deaths += player.getDeaths();

            totalDamage +=
                    player.getTotalDamageDealtToChampions();


            if (player.isWin()) {
                wins++;
            }
        }


        // =====================================================
        // 7. Calculate K/D
        // =====================================================

        double kd = 0.0;

        if (deaths > 0) {

            kd =
                    (double) kills /
                            deaths;
        }


        // =====================================================
        // 8. Calculate average damage
        // =====================================================

        double averageDamage = 0.0;

        if (matches > 0) {

            averageDamage =
                    (double) totalDamage /
                            matches;
        }


        // =====================================================
        // 9. Create response
        // =====================================================

        GamePlayerStatsResponse response =
                new GamePlayerStatsResponse();

        response.setGame(
                "League of Legends"
        );

        response.setPlayerName(
                gameName + "#" + tagLine
        );

        response.setKd(
                Math.round(kd * 100.0) / 100.0
        );

        response.setKills(
                kills
        );

        response.setMatches(
                matches
        );

        response.setWins(
                wins
        );

        response.setAverageDamage(
                Math.round(averageDamage * 100.0) / 100.0
        );

        // Not calculated yet
        response.setAverageSurvivalTime(
                0
        );


        // =====================================================
        // 10. Rank
        // =====================================================

        response.setRank(
                "Summoner Level " +
                        summoner.getSummonerLevel()
        );


        return response;
    }
}

