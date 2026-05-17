package com.gamestats.platform.service.impl;

import com.gamestats.platform.dto.MatchStatsResponse;
import com.gamestats.platform.model.GameMatch;
import com.gamestats.platform.repository.GameMatchRepository;
import com.gamestats.platform.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsServiceImpl implements StatsService {

    private final GameMatchRepository gameMatchRepository;

    @Override
    public MatchStatsResponse calculatePlayerStats(String username) {

        List<GameMatch> matches =
                gameMatchRepository.findByPlayerUsername(username);

        int totalMatches = matches.size();

        int wins = (int) matches.stream()
                .filter(GameMatch::getWin)
                .count();

        int losses = totalMatches - wins;

        double winRate =
                totalMatches == 0
                        ? 0
                        : (wins * 100.0 / totalMatches);

        int totalKills = matches.stream()
                .mapToInt(GameMatch::getKills)
                .sum();

        int totalDeaths = matches.stream()
                .mapToInt(GameMatch::getDeaths)
                .sum();

        double avgKills =
                totalMatches == 0
                        ? 0
                        : (double) totalKills / totalMatches;

        double kdRatio =
                totalDeaths == 0
                        ? totalKills
                        : (double) totalKills / totalDeaths;

        return new MatchStatsResponse(
                totalMatches,
                wins,
                losses,
                winRate,
                avgKills,
                kdRatio
        );
    }
}