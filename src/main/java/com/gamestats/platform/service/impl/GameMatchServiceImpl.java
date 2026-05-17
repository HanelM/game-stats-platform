package com.gamestats.platform.service.impl;

import com.gamestats.platform.dto.*;
import com.gamestats.platform.mapper.GameMatchMapper;
import com.gamestats.platform.model.GameMatch;
import com.gamestats.platform.repository.GameMatchRepository;
import com.gamestats.platform.service.GameMatchService;
import com.gamestats.platform.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GameMatchServiceImpl implements GameMatchService {

    private final GameMatchRepository gameMatchRepository;
    private final StatsService statsService;

    @Override
    public GameMatch saveMatch(GameMatchRequest request, String username) {

        GameMatch gameMatch = GameMatch.builder()
                .playerUsername(username)
                .gameName(request.getGameName())
                .score(request.getScore())
                .kills(request.getKills())
                .deaths(request.getDeaths())
                .win(request.getWin())
                .playedAt(LocalDateTime.now())
                .build();

        return gameMatchRepository.save(gameMatch);
    }

    @Override
    public Page<GameMatch> getPlayerMatches(
            String username,
            int page,
            int size,
            String sortBy
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortBy).descending()
        );

        return gameMatchRepository.findByPlayerUsername(username, pageable);
    }

    @Override
    public MatchStatsResponse getPlayerStats(String username) {
        return statsService.calculatePlayerStats(username);
    }

    @Override
    public List<GameMatchResponse> searchMatches(
            String username,
            String gameName,
            Boolean win,
            Integer minScore,
            String sortBy
    ) {

        Sort sort = Sort.by(
                Sort.Direction.DESC,
                sortBy == null ? "playedAt" : sortBy
        );

        List<GameMatch> matches;

        if (gameName != null && !gameName.isBlank()) {

            matches = gameMatchRepository
                    .findByPlayerUsernameAndGameNameContainingIgnoreCase(
                            username,
                            gameName,
                            sort
                    );

        } else if (win != null) {

            matches = gameMatchRepository
                    .findByPlayerUsernameAndWin(
                            username,
                            win,
                            sort
                    );

        } else if (minScore != null) {

            matches = gameMatchRepository
                    .findByPlayerUsernameAndScoreGreaterThanEqual(
                            username,
                            minScore,
                            sort
                    );

        } else {

            matches = gameMatchRepository.findByPlayerUsername(username, sort);
        }

        return matches.stream()
                .map(GameMatchMapper::toResponse)
                .toList();
    }

    @Override
    public AnalyticsResponse getAnalytics(String username) {

        List<GameMatch> matches =
                gameMatchRepository.findByPlayerUsername(username);

        long totalMatches = matches.size();

        long wins = matches.stream()
                .filter(GameMatch::getWin)
                .count();

        long losses = totalMatches - wins;

        int totalKills = matches.stream()
                .mapToInt(GameMatch::getKills)
                .sum();

        int totalDeaths = matches.stream()
                .mapToInt(GameMatch::getDeaths)
                .sum();

        int bestScore = matches.stream()
                .mapToInt(GameMatch::getScore)
                .max()
                .orElse(0);

        double averageScore = matches.stream()
                .mapToInt(GameMatch::getScore)
                .average()
                .orElse(0);

        double winRate = totalMatches > 0
                ? ((double) wins / totalMatches) * 100
                : 0;

        double kdRatio = totalDeaths > 0
                ? (double) totalKills / totalDeaths
                : totalKills;

        return AnalyticsResponse.builder()
                .totalMatches(totalMatches)
                .wins(wins)
                .losses(losses)
                .winRate(Math.round(winRate * 100.0) / 100.0)
                .totalKills(totalKills)
                .totalDeaths(totalDeaths)
                .kdRatio(Math.round(kdRatio * 100.0) / 100.0)
                .bestScore(bestScore)
                .averageScore(Math.round(averageScore * 100.0) / 100.0)
                .build();
    }

    @Override
    public List<GameMatchResponse> getMatchesBetweenDates(
            String username,
            LocalDate from,
            LocalDate to
    ) {
        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.atTime(23, 59, 59);

        List<GameMatch> matches =
                gameMatchRepository.findByPlayerUsernameAndPlayedAtBetween(
                        username,
                        start,
                        end,
                        Sort.by("playedAt").descending()
                );

        return matches.stream()
                .map(GameMatchMapper::toResponse)
                .toList();
    }
}