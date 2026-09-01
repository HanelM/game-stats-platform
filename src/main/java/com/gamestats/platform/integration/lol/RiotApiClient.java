package com.gamestats.platform.integration.lol;

import com.gamestats.platform.integration.lol.dto.LolLeagueEntryResponse;
import com.gamestats.platform.integration.lol.dto.LeagueSummonerResponse;
import com.gamestats.platform.integration.lol.dto.RiotAccountResponse;
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

    public RiotAccountResponse getAccount(
            String gameName,
            String tagLine
    ) {

        return webClient.get()
                .uri(
                        "https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/"
                                + encode(gameName)
                                + "/"
                                + encode(tagLine)
                )
                .header("X-Riot-Token", apiKey)
                .retrieve()
                .bodyToMono(RiotAccountResponse.class)
                .block();
    }

    public LeagueSummonerResponse getSummoner(String puuid) {

        return webClient.get()
                .uri("https://europe.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/"
                        + puuid)
                .header("X-Riot-Token", apiKey)
                .retrieve()
                .bodyToMono(LeagueSummonerResponse.class)
                .block();
    }

    public List<LolLeagueEntryResponse> getRankedData(String summonerId) {

        LolLeagueEntryResponse[] response =
                webClient.get()
                        .uri("https://europe.api.riotgames.com/lol/league/v4/entries/by-summoner/"
                                + summonerId)
                        .header("X-Riot-Token", apiKey)
                        .retrieve()
                        .bodyToMono(LolLeagueEntryResponse[].class)
                        .block();

        return response == null
                ? List.of()
                : Arrays.asList(response);
    }

    private String encode(String value) {

        return java.net.URLEncoder
                .encode(
                        value,
                        java.nio.charset.StandardCharsets.UTF_8
                )
                .replace("+", "%20");
    }
}