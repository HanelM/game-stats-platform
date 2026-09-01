package com.gamestats.platform.integration.lol.dto;

import lombok.Data;

import java.util.List;

@Data
public class LolMatchInfo {

    private Long gameCreation;

    private Long gameDuration;

    private Long gameId;

    private String gameMode;

    private String gameName;

    private Integer queueId;

    private String platformId;

    private List<LolParticipant> participants;
}