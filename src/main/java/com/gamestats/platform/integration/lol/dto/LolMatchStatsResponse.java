package com.gamestats.platform.integration.lol.dto;

import lombok.Data;

@Data
public class LolMatchStatsResponse {

    private LolMatchMetadata metadata;

    private LolMatchInfo info;
}