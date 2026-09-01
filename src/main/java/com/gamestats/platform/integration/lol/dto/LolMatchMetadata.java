package com.gamestats.platform.integration.lol.dto;

import lombok.Data;

import java.util.List;

@Data
public class LolMatchMetadata {

    private String matchId;

    private String dataVersion;

    private List<String> participants;
}