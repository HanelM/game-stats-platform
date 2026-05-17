package com.gamestats.platform.service;

import com.gamestats.platform.dto.GameMatchRequest;
import com.gamestats.platform.dto.MatchStatsResponse;
import com.gamestats.platform.model.GameMatch;
import org.springframework.data.domain.Page;
import com.gamestats.platform.dto.AnalyticsResponse;
import java.time.LocalDate;
import com.gamestats.platform.dto.GameMatchResponse;



import java.util.List;

public interface GameMatchService {

    GameMatch saveMatch(
            GameMatchRequest request,
            String username
    );

    Page<GameMatch> getPlayerMatches(

            String username,

            int page,

            int size,

            String sortBy
    );

    MatchStatsResponse getPlayerStats(
            String username
    );

    AnalyticsResponse getAnalytics(
            String username
    );
    List<GameMatchResponse> searchMatches(
            String username,
            String gameName,
            Boolean win,
            Integer minScore,
            String sortBy
    );

    List<GameMatchResponse> getMatchesBetweenDates(
            String username,
            LocalDate from,
            LocalDate to
    );

}