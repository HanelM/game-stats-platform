package com.gamestats.platform.integration.lol.dto;

import lombok.Data;

import java.util.List;

@Data
public class RiotMatchIdsResponse {

    private List<String> matchIds;
}