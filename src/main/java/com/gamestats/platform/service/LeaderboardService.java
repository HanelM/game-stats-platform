package com.gamestats.platform.service;

import java.util.List;
import java.util.Map;

public interface LeaderboardService {

    List<Map<String, Object>> getLeaderboard();
}