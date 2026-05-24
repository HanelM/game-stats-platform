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
import com.gamestats.platform.repository.GameMatchRepository;

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

                /* PUBG */

                .placement(request.getPlacement())

                .damage(request.getDamage())

                .survivalTime(request.getSurvivalTime())

                /* CS2 / VALORANT */

                .assists(request.getAssists())

                .headshots(request.getHeadshots())

                /* VALORANT */

                .combatScore(request.getCombatScore())

                /* LEAGUE OF LEGENDS */

                .cs(request.getCs())

                .gold(request.getGold())

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
                .filter(match -> Boolean.TRUE.equals(match.getWin()))
                .count();

        long losses = totalMatches - wins;

        int totalKills = matches.stream()
                .mapToInt(match -> match.getKills() != null ? match.getKills() : 0)
                .sum();

        int totalDeaths = matches.stream()
                .mapToInt(match -> match.getDeaths() != null ? match.getDeaths() : 0)
                .sum();

        int bestScore = matches.stream()
                .mapToInt(match -> match.getScore() != null ? match.getScore() : 0)
                .max()
                .orElse(0);

        int bestKillMatch = matches.stream()
                .mapToInt(match -> match.getKills() != null ? match.getKills() : 0)
                .max()
                .orElse(0);

        double highestKD = matches.stream()
                .mapToDouble(match -> {

                    if(match.getDeaths() == null || match.getDeaths() == 0){

                        return match.getKills() != null ? match.getKills() : 0;
                    }

                    return (double)
                            match.getKills()
                            / match.getDeaths();

                })
                .max()
                .orElse(0);

        double averageScore = matches.stream()
                .mapToInt(match -> match.getScore() != null ? match.getScore() : 0)
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

                .winRate(
                        Math.round(winRate * 100.0) / 100.0
                )

                .totalKills(totalKills)

                .totalDeaths(totalDeaths)

                .kdRatio(
                        Math.round(kdRatio * 100.0) / 100.0
                )

                .bestScore(bestScore)

                .averageScore(
                        Math.round(averageScore * 100.0) / 100.0
                )

                .bestKillMatch(bestKillMatch)

                .highestKD(
                        Math.round(highestKD * 100.0) / 100.0
                )

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



    @Override
    public AnalyticsResponse getAnalyticsForUser(
            String username
    ){

        List<GameMatch> matches =
                gameMatchRepository.findByPlayerUsername(username);

        return buildAnalytics(matches);
    }

    @Override
    public List<GameMatch> getMatchesForUser(
            String username
    ){

        return gameMatchRepository.findByPlayerUsername(username);
    }
    private AnalyticsResponse buildAnalytics(
            List<GameMatch> matches
    ){

        long totalMatches = matches.size();

        long wins = matches.stream()
                .filter(match -> Boolean.TRUE.equals(match.getWin()))
                .count();

        long losses = totalMatches - wins;

        int totalKills = matches.stream()
                .mapToInt(match -> match.getKills() != null ? match.getKills() : 0)
                .sum();

        int totalDeaths = matches.stream()
                .mapToInt(match -> match.getDeaths() != null ? match.getDeaths() : 0)
                .sum();

        int bestScore = matches.stream()
                .mapToInt(match -> match.getScore() != null ? match.getScore() : 0)
                .max()
                .orElse(0);

        int bestKillMatch = matches.stream()
                .mapToInt(match -> match.getKills() != null ? match.getKills() : 0)
                .max()
                .orElse(0);

        double highestKD = matches.stream()
                .mapToDouble(match -> {

                    if(match.getDeaths() == null || match.getDeaths() == 0){

                        return match.getKills() != null ? match.getKills() : 0;
                    }

                    return (double)
                            match.getKills()
                            / match.getDeaths();

                })
                .max()
                .orElse(0);

        double averageScore = matches.stream()
                .mapToInt(match -> match.getScore() != null ? match.getScore() : 0)
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

                .winRate(
                        Math.round(winRate * 100.0) / 100.0
                )

                .totalKills(totalKills)

                .totalDeaths(totalDeaths)

                .kdRatio(
                        Math.round(kdRatio * 100.0) / 100.0
                )

                .bestScore(bestScore)

                .averageScore(
                        Math.round(averageScore * 100.0) / 100.0
                )

                .bestKillMatch(bestKillMatch)

                .highestKD(
                        Math.round(highestKD * 100.0) / 100.0
                )

                .build();
    }


}