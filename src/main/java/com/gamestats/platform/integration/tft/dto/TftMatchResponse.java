package com.gamestats.platform.integration.tft.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TftMatchResponse {

    private Info info;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Info {

        @JsonProperty("game_datetime")
        private long gameDatetime;

        @JsonProperty("game_length")
        private double gameLength;

        @JsonProperty("game_version")
        private String gameVersion;

        private List<Participant> participants;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Participant {

        private String puuid;

        private int placement;

        @JsonProperty("players_eliminated")
        private int playersEliminated;

        @JsonProperty("total_damage_to_players")
        private int totalDamageToPlayers;

        @JsonProperty("gold_left")
        private int goldLeft;

        private int level;

        @JsonProperty("time_eliminated")
        private double timeEliminated;

        @JsonProperty("last_round")
        private int lastRound;

        private List<Trait> traits;

        private List<Unit> units;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Trait {

        private String name;

        @JsonProperty("num_units")
        private int numUnits;

        @JsonProperty("tier_current")
        private int tierCurrent;

        @JsonProperty("tier_total")
        private int tierTotal;

        private int style;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Unit {

        @JsonProperty("character_id")
        private String characterId;

        private String name;

        private int rarity;

        private int tier;

        private int cost;
    }
}