package com.gamestats.platform.integration.pubg.dto;

import lombok.Data;

@Data
public class PubgMatchIncluded {

    private String type;

    private PubgMatchAttributes attributes;
}