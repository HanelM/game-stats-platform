package com.gamestats.platform.integration.lol;

import com.gamestats.platform.integration.lol.dto.LeagueSummonerResponse;
import com.gamestats.platform.integration.lol.dto.RiotAccountResponse;
import com.gamestats.platform.integration.lol.dto.RiotMatchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class RiotApiClient {

    private final WebClient webClient;

    @Value("${riot.api.key}")
    private String apiKey;


    // =========================================================
    // RIOT ACCOUNT
    // =========================================================

    public RiotAccountResponse getAccount(
            String gameName,
            String tagLine
    ) {

        return webClient.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .scheme("https")
                                .host("asia.api.riotgames.com")
                                .path(
                                        "/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}"
                                )
                                .build(
                                        gameName,
                                        tagLine
                                )
                )
                .header(
                        "X-Riot-Token",
                        apiKey
                )
                .retrieve()
                .bodyToMono(
                        RiotAccountResponse.class
                )
                .block();
    }


    // =========================================================
    // SUMMONER
    // =========================================================

    public LeagueSummonerResponse getSummoner(
            String puuid
    ) {

        return webClient.get()
                .uri(
                        "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}",
                        puuid
                )
                .header(
                        "X-Riot-Token",
                        apiKey
                )
                .retrieve()
                .bodyToMono(
                        LeagueSummonerResponse.class
                )
                .block();
    }


    // =========================================================
    // MATCH HISTORY
    // =========================================================

    public List<String> getMatchIds(
            String puuid,
            int count
    ) {

        String[] response =
                webClient.get()
                        .uri(uriBuilder ->
                                uriBuilder
                                        .scheme("https")
                                        .host("asia.api.riotgames.com")
                                        .path(
                                                "/lol/match/v5/matches/by-puuid/{puuid}/ids"
                                        )
                                        .queryParam(
                                                "start",
                                                0
                                        )
                                        .queryParam(
                                                "count",
                                                count
                                        )
                                        .build(
                                                puuid
                                        )
                        )
                        .header(
                                "X-Riot-Token",
                                apiKey
                        )
                        .retrieve()
                        .bodyToMono(
                                String[].class
                        )
                        .block();

        return response == null
                ? List.of()
                : Arrays.asList(response);
    }


    // =========================================================
    // SINGLE MATCH
    // =========================================================

    public RiotMatchResponse getMatch(
            String matchId
    ) {

        return webClient.get()
                .uri(
                        "https://asia.api.riotgames.com/lol/match/v5/matches/{matchId}",
                        matchId
                )
                .header(
                        "X-Riot-Token",
                        apiKey
                )
                .retrieve()
                .bodyToMono(
                        RiotMatchResponse.class
                )
                .block();
    }
}