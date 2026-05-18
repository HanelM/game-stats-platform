package com.gamestats.platform.integration.provider;

import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import com.gamestats.platform.integration.pubg.dto.PubgPlayerResponse;
import com.gamestats.platform.integration.pubg.dto.PubgMatchResponse;
import com.gamestats.platform.integration.pubg.dto.PubgMatchIncluded;
import com.gamestats.platform.integration.pubg.dto.PubgStats;
import java.util.List;
import org.springframework.cache.annotation.Cacheable;
import com.gamestats.platform.integration.entity.PlayerStats;
import com.gamestats.platform.integration.repository.PlayerStatsRepository;
import com.gamestats.platform.exception.ResourceNotFoundException;

import java.time.LocalDateTime;
import java.util.Optional;




@Component
@RequiredArgsConstructor
public class PubgProvider
        implements GameProvider {

    private final WebClient webClient;
    private final PlayerStatsRepository playerStatsRepository;

    @Value("${pubg.api.key}")
    private String apiKey;

    @Override
    public String getGameName() {

        return "pubg";
    }


    @Override
    @Cacheable(
            value = "playerStats",
            key = "#playerName"
    )
    public GamePlayerStatsResponse getPlayerStats(
            String playerName
    ) {
        Optional<PlayerStats> cachedStats =
                playerStatsRepository
                        .findTopByPlayerNameIgnoreCaseAndGameOrderByCreatedAtDesc(
                                playerName,
                                "PUBG"
                        );

        if(cachedStats.isPresent()){
            System.out.println("CACHE FOUND");

            PlayerStats cached =
                    cachedStats.get();

            if(cached.getCreatedAt() != null
                    &&

                    cached.getCreatedAt()
                            .isAfter(
                                    LocalDateTime.now()
                                            .minusMinutes(30)
                            )){

                GamePlayerStatsResponse cachedResponse =
                        new GamePlayerStatsResponse();

                cachedResponse.setGame(
                        cached.getGame()
                );

                cachedResponse.setPlayerName(
                        cached.getPlayerName()
                );

                cachedResponse.setKd(
                        cached.getKd()
                );

                cachedResponse.setWins(
                        cached.getWins()
                );

                cachedResponse.setKills(
                        cached.getKills()
                );

                cachedResponse.setMatches(
                        cached.getMatches()
                );

                cachedResponse.setRank(
                        "Cached PUBG Data"
                );

                cachedResponse.setAverageDamage(
                        cached.getAverageDamage()
                );

                cachedResponse.setAverageSurvivalTime(
                        cached.getAverageSurvivalTime()
                );
                System.out.println("RETURNING CACHED DATA");
                return cachedResponse;
            }
        }


        PubgPlayerResponse response =
                webClient.get()

                        .uri(
                                "https://api.pubg.com/shards/steam/players?filter[playerNames]="
                                        + playerName
                        )

                        .header(
                                "Authorization",
                                "Bearer " + apiKey
                        )

                        .header(
                                "Accept",
                                "application/vnd.api+json"
                        )

                        .retrieve()

                        .bodyToMono(PubgPlayerResponse.class)

                        .block();

        if(response == null ||
                response.getData() == null ||
                response.getData().isEmpty()){

            throw new ResourceNotFoundException(
                    "PUBG player not found"
            );
        }

        String pubgPlayerId =
                response.getData()
                        .get(0)
                        .getId();

        String pubgPlayerName =
                response.getData()
                        .get(0)
                        .getAttributes()
                        .getName();

        PubgMatchResponse matchResponse = null;
        int totalKills = 0;

        int totalWins = 0;

        int totalMatches = 0;

        double totalDamage = 0;

        double totalSurvivalTime = 0;
        if(response.getData()
                .get(0)
                .getRelationships()
                .getMatches()
                .getData() != null

                &&

                !response.getData()
                        .get(0)
                        .getRelationships()
                        .getMatches()
                        .getData()
                        .isEmpty()){

            List<String> matchIds =
                    response.getData()
                            .get(0)
                            .getRelationships()
                            .getMatches()
                            .getData()
                            .stream()
                            .limit(20)
                            .map(match -> match.getId())
                            .toList();



            for(String matchId : matchIds){

                matchResponse =
                        webClient.get()

                                .uri(
                                        "https://api.pubg.com/shards/steam/matches/"
                                                + matchId
                                )

                                .header(
                                        "Authorization",
                                        "Bearer " + apiKey
                                )

                                .header(
                                        "Accept",
                                        "application/vnd.api+json"
                                )

                                .retrieve()

                                .bodyToMono(PubgMatchResponse.class)

                                .block();

                if(matchResponse == null
                        || matchResponse.getIncluded() == null){

                    continue;
                }

                for(PubgMatchIncluded included
                        : matchResponse.getIncluded()){

                    if(included.getAttributes() == null
                            || included.getAttributes().getStats() == null){

                        continue;
                    }

                    PubgStats pubgStats =
                            included.getAttributes().getStats();

                    if(pubgStats.getKills() != null
                            && pubgStats.getName() != null
                            && pubgStats.getName()
                            .equalsIgnoreCase(pubgPlayerName)){

                        totalKills +=
                                pubgStats.getKills();

                        totalMatches++;

                        if(pubgStats.getDamageDealt() != null){

                            totalDamage +=
                                    pubgStats.getDamageDealt();
                        }

                        if(pubgStats.getTimeSurvived() != null){

                            totalSurvivalTime +=
                                    pubgStats.getTimeSurvived();
                        }

                        if(pubgStats.getWinPlace() != null
                                && pubgStats.getWinPlace() == 1){

                            totalWins++;
                        }
                    }
                }
            }
        }
        else{

            System.out.println(
                    "No matches found"
            );
        }


        System.out.println(pubgPlayerId);
        System.out.println(pubgPlayerName);

        System.out.println(response);



        double kd = totalMatches > 0
                ? (double) totalKills / totalMatches
                : 0;

        double averageDamage = totalMatches > 0
                ? totalDamage / totalMatches
                : 0;

        double averageSurvivalTime = totalMatches > 0
                ? totalSurvivalTime / totalMatches
                : 0;
        GamePlayerStatsResponse stats =
                new GamePlayerStatsResponse();

        stats.setGame("PUBG");

        stats.setPlayerName(pubgPlayerName);

        stats.setKd(
                Math.round(kd * 100.0) / 100.0
        );

        stats.setWins(totalWins);

        stats.setKills(totalKills);

        stats.setMatches(totalMatches);
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

        stats.setRank("Live PUBG Data");
        PlayerStats playerStats =
                new PlayerStats();

        playerStats.setGame(
                stats.getGame()
        );

        playerStats.setPlayerName(
                stats.getPlayerName()
        );

        playerStats.setKd(
                stats.getKd()
        );

        playerStats.setWins(
                stats.getWins()
        );

        playerStats.setKills(
                stats.getKills()
        );

        playerStats.setMatches(
                stats.getMatches()
        );

        playerStats.setAverageDamage(
                stats.getAverageDamage()
        );

        playerStats.setAverageSurvivalTime(
                stats.getAverageSurvivalTime()
        );

        playerStats.setRank(
                stats.getRank()
        );

        playerStats.setCreatedAt(
                LocalDateTime.now()
        );

        playerStatsRepository.save(
                playerStats
        );


        return stats;

    }

}