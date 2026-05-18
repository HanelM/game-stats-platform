package com.gamestats.platform.integration.pubg.dto;

import lombok.Data;

import java.util.List;

@Data
public class PubgPlayerResponse {

    private List<PubgPlayerData> data;
}