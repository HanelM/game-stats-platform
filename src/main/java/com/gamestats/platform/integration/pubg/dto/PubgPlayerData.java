package com.gamestats.platform.integration.pubg.dto;

import lombok.Data;

@Data
public class PubgPlayerData {

    private String id;

    private PubgAttributes attributes;

    private PubgRelationships relationships;
}