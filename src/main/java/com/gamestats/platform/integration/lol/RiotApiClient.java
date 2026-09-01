package com.gamestats.platform.integration.lol;

import com.gamestats.platform.integration.lol.dto.LeagueSummonerResponse;
import com.gamestats.platform.integration.lol.dto.RiotAccountResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class RiotApiClient {

    private final WebClient webClient;

    @Value("${riot.api.key}")
    private String apiKey;

    /**
     * Gets Riot account information using Riot ID.
     *
     * Example:
     * Faker#KR1
     */
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

    /**
     * Gets League of Legends summoner information
     * using the PUUID returned by the Riot Account API.
     */
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
}

