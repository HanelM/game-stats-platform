package com.gamestats.platform.integration.lol.dto;

import lombok.Data;

import java.util.List;

@Data
public class RiotMatchResponse {

    private Info info;

    @Data
    public static class Info {

        private List<Participant> participants;
    }

    @Data
    public static class Participant {

        private String puuid;

        private int kills;

        private int deaths;

        private int assists;

        private int totalDamageDealtToChampions;

        private boolean win;
    }
}