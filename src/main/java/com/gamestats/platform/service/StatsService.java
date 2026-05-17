package com.gamestats.platform.service;

import com.gamestats.platform.dto.MatchStatsResponse;

public interface StatsService {

    MatchStatsResponse calculatePlayerStats(String username);
}