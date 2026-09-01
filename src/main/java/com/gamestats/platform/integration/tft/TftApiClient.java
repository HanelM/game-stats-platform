package com.gamestats.platform.integration.tft;

import com.gamestats.platform.integration.lol.dto.RiotAccountResponse;
import com.gamestats.platform.integration.tft.dto.TftMatchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TftApiClient {

    private final WebClient webClient;

    @Value("${riot.api.key}")
    private String apiKey;

    @Value("${riot.tft.region}")
    private String regionHost;


    // =========================================================
    // RIOT ACCOUNT
    // Riot ID -> PUUID
    // =========================================================

    public RiotAccountResponse getAccount(
            String gameName,
            String tagLine
    ) {

        return webClient.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .scheme("https")
                                .host(regionHost)
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
    // TFT MATCH IDS
    // PUUID -> Match IDs
    // =========================================================

    public List<String> getMatchIds(
            String puuid,
            int count
    ) {

        String[] response = webClient.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .scheme("https")
                                .host(regionHost)
                                .path(
                                        "/tft/match/v1/matches/by-puuid/{puuid}/ids"
                                )
                                .queryParam("start", 0)
                                .queryParam("count", count)
                                .build(puuid)
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
    // TFT MATCH
    // Match ID -> Match details
    // =========================================================

    public TftMatchResponse getMatch(String matchId) {

        return webClient.get()
                .uri(
                        "https://" +
                                regionHost +
                                "/tft/match/v1/matches/{matchId}",
                        matchId
                )
                .header("X-Riot-Token", apiKey)
                .retrieve()
                .bodyToMono(TftMatchResponse.class)
                .block();
    }
}