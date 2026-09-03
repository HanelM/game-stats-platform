package com.gamestats.platform.integration.tft;

import com.gamestats.platform.integration.lol.dto.RiotAccountResponse;
import com.gamestats.platform.integration.tft.dto.TftMatchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
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

        System.out.println("========================================");
        System.out.println("TFT ACCOUNT REQUEST");
        System.out.println("Game Name: " + gameName);
        System.out.println("Tag Line: " + tagLine);
        System.out.println("Region Host: " + regionHost);
        System.out.println("========================================");

        RiotAccountResponse response = webClient.get()
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
                .onStatus(
                        HttpStatusCode::isError,
                        clientResponse ->
                                clientResponse
                                        .bodyToMono(String.class)
                                        .map(body ->
                                                new RuntimeException(
                                                        "Riot Account API error: "
                                                                + clientResponse.statusCode()
                                                                + " - "
                                                                + body
                                                )
                                        )
                )
                .bodyToMono(
                        RiotAccountResponse.class
                )
                .block();

        if (response == null) {
            System.out.println("TFT ACCOUNT RESPONSE: NULL");
        } else {
            System.out.println("TFT ACCOUNT PUUID: "
                    + response.getPuuid());

            System.out.println("TFT ACCOUNT GAME NAME: "
                    + response.getGameName());

            System.out.println("TFT ACCOUNT TAG LINE: "
                    + response.getTagLine());
        }

        return response;
    }


    // =========================================================
    // TFT MATCH IDS
    // PUUID -> Match IDs
    // =========================================================

    public List<String> getMatchIds(
            String puuid,
            int count
    ) {

        System.out.println("========================================");
        System.out.println("TFT MATCH IDS REQUEST");
        System.out.println("PUUID: " + puuid);
        System.out.println("Count: " + count);
        System.out.println("Region Host: " + regionHost);
        System.out.println("========================================");

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
                .onStatus(
                        HttpStatusCode::isError,
                        clientResponse ->
                                clientResponse
                                        .bodyToMono(String.class)
                                        .map(body ->
                                                new RuntimeException(
                                                        "Riot TFT Match IDs API error: "
                                                                + clientResponse.statusCode()
                                                                + " - "
                                                                + body
                                                )
                                        )
                )
                .bodyToMono(
                        String[].class
                )
                .block();

        if (response == null) {

            System.out.println(
                    "TFT MATCH IDS RESPONSE: NULL"
            );

            return List.of();
        }

        System.out.println(
                "TFT MATCH IDS FOUND: "
                        + response.length
        );

        if (response.length > 0) {

            System.out.println(
                    "TFT FIRST MATCH ID: "
                            + response[0]
            );
        }

        return Arrays.asList(response);
    }


    // =========================================================
    // TFT MATCH
    // Match ID -> Match details
    // =========================================================

    public TftMatchResponse getMatch(
            String matchId
    ) {

        System.out.println(
                "TFT MATCH REQUEST: "
                        + matchId
        );

        TftMatchResponse response = webClient.get()
                .uri(
                        "https://"
                                + regionHost
                                + "/tft/match/v1/matches/{matchId}",
                        matchId
                )
                .header(
                        "X-Riot-Token",
                        apiKey
                )
                .retrieve()
                .onStatus(
                        HttpStatusCode::isError,
                        clientResponse ->
                                clientResponse
                                        .bodyToMono(String.class)
                                        .map(body ->
                                                new RuntimeException(
                                                        "Riot TFT Match API error: "
                                                                + clientResponse.statusCode()
                                                                + " - "
                                                                + body
                                                )
                                        )
                )
                .bodyToMono(
                        TftMatchResponse.class
                )
                .block();

        if (response == null) {

            System.out.println(
                    "TFT MATCH RESPONSE: NULL"
            );

        } else if (response.getInfo() == null) {

            System.out.println(
                    "TFT MATCH INFO: NULL"
            );

        } else if (response.getInfo().getParticipants() == null) {

            System.out.println(
                    "TFT PARTICIPANTS: NULL"
            );

        } else {

            System.out.println(
                    "TFT PARTICIPANTS FOUND: "
                            + response
                            .getInfo()
                            .getParticipants()
                            .size()
            );
        }

        return response;
    }
}

