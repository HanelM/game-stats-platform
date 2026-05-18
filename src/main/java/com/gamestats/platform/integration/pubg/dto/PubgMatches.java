package com.gamestats.platform.integration.pubg.dto;

import lombok.Data;

import java.util.List;

@Data
public class PubgMatches {

    private List<PubgMatchData> data;
}