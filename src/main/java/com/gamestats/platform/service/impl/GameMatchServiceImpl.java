package com.gamestats.platform.service.impl;

import com.gamestats.platform.dto.AnalyticsResponse;
import com.gamestats.platform.dto.GameMatchRequest;
import com.gamestats.platform.dto.GameMatchResponse;
import com.gamestats.platform.dto.MatchStatsResponse;
import com.gamestats.platform.mapper.GameMatchMapper;
import com.gamestats.platform.model.GameMatch;
import com.gamestats.platform.repository.GameMatchRepository;
import com.gamestats.platform.service.GameMatchService;
import com.gamestats.platform.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GameMatchServiceImpl implements GameMatchService {

    private final GameMatchRepository gameMatchRepository;
    private final StatsService statsService;


    // =========================================================
    // SAVE MANUAL MATCH
    // =========================================================

    @Override
    public GameMatch saveMatch(GameMatchRequest request, String username) {

        GameMatch gameMatch = GameMatch.builder()

                // Owner of the match
                .playerUsername(username)

                // General information
                .gameName(request.getGameName())
                .score(request.getScore())
                .kills(request.getKills())
                .deaths(request.getDeaths())
                .win(request.getWin())

                // PUBG
                .placement(request.getPlacement())
                .damage(request.getDamage())
                .survivalTime(request.getSurvivalTime())

                // CS2 / VALORANT
                .assists(request.getAssists())
                .headshots(request.getHeadshots())

                // VALORANT
                .combatScore(request.getCombatScore())

                // LEAGUE OF LEGENDS
                .cs(request.getCs())
                .gold(request.getGold())

                // This match was entered manually
                .source("MANUAL")

                // Match creation time
                .playedAt(LocalDateTime.now())

                .build();

        return gameMatchRepository.save(gameMatch);
    }


    // =========================================================
    // GET PLAYER MATCHES - PAGINATED
    // =========================================================

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

        return gameMatchRepository.findByPlayerUsername(
                username,
                pageable
        );
    }

    @Override
    public List<GameMatch> getAllPlayerMatches(String username) {

        return gameMatchRepository.findByPlayerUsername(
                username,
                Sort.by(Sort.Direction.DESC, "playedAt")
        );
    }


    // =========================================================
    // GET PLAYER STATISTICS
    // =========================================================

    @Override
    public MatchStatsResponse getPlayerStats(String username) {

        return statsService.calculatePlayerStats(username);
    }


    // =========================================================
    // SEARCH MATCHES
    // =========================================================

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
                sortBy == null || sortBy.isBlank()
                        ? "playedAt"
                        : sortBy
        );

        List<GameMatch> matches;

        // Search by game
        if (gameName != null && !gameName.isBlank()) {

            matches = gameMatchRepository
                    .findByPlayerUsernameAndGameNameContainingIgnoreCase(
                            username,
                            gameName,
                            sort
                    );

        }

        // Search by result
        else if (win != null) {

            matches = gameMatchRepository
                    .findByPlayerUsernameAndWin(
                            username,
                            win,
                            sort
                    );

        }

        // Search by minimum score
        else if (minScore != null) {

            matches = gameMatchRepository
                    .findByPlayerUsernameAndScoreGreaterThanEqual(
                            username,
                            minScore,
                            sort
                    );

        }

        // Return all matches
        else {

            matches = gameMatchRepository.findByPlayerUsername(
                    username,
                    sort
            );
        }

        return matches.stream()
                .map(GameMatchMapper::toResponse)
                .toList();
    }


    // =========================================================
    // GET ANALYTICS
    // =========================================================

    @Override
    public AnalyticsResponse getAnalytics(String username) {

        List<GameMatch> matches =
                gameMatchRepository.findByPlayerUsername(username);

        return buildAnalytics(matches);
    }


    // =========================================================
    // GET MATCHES BETWEEN DATES
    // =========================================================

    @Override
    public List<GameMatchResponse> getMatchesBetweenDates(
            String username,
            LocalDate from,
            LocalDate to
    ) {

        LocalDateTime start = from.atStartOfDay();

        LocalDateTime end = to.atTime(
                23,
                59,
                59
        );

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


    // =========================================================
    // GET ANALYTICS FOR USER
    // =========================================================

    @Override
    public AnalyticsResponse getAnalyticsForUser(
            String username
    ) {

        List<GameMatch> matches =
                gameMatchRepository.findByPlayerUsername(username);

        return buildAnalytics(matches);
    }


    // =========================================================
    // GET ALL MATCHES FOR USER
    // =========================================================

    @Override
    public List<GameMatch> getMatchesForUser(
            String username
    ) {

        return gameMatchRepository.findByPlayerUsername(username);
    }


    // =========================================================
    // BUILD ANALYTICS
    // =========================================================

    private AnalyticsResponse buildAnalytics(
            List<GameMatch> matches
    ) {

        long totalMatches = matches.size();


        // -----------------------------------------------------
        // WINS
        // -----------------------------------------------------

        long wins = matches.stream()
                .filter(match ->
                        Boolean.TRUE.equals(match.getWin())
                )
                .count();


        // -----------------------------------------------------
        // LOSSES
        // -----------------------------------------------------

        long losses = totalMatches - wins;


        // -----------------------------------------------------
        // TOTAL KILLS
        // -----------------------------------------------------

        int totalKills = matches.stream()
                .mapToInt(match ->
                        match.getKills() != null
                                ? match.getKills()
                                : 0
                )
                .sum();


        // -----------------------------------------------------
        // TOTAL DEATHS
        // -----------------------------------------------------

        int totalDeaths = matches.stream()
                .mapToInt(match ->
                        match.getDeaths() != null
                                ? match.getDeaths()
                                : 0
                )
                .sum();


        // -----------------------------------------------------
        // BEST SCORE
        // -----------------------------------------------------

        int bestScore = matches.stream()
                .mapToInt(match ->
                        match.getScore() != null
                                ? match.getScore()
                                : 0
                )
                .max()
                .orElse(0);


        // -----------------------------------------------------
        // BEST KILL MATCH
        // -----------------------------------------------------

        int bestKillMatch = matches.stream()
                .mapToInt(match ->
                        match.getKills() != null
                                ? match.getKills()
                                : 0
                )
                .max()
                .orElse(0);


        // -----------------------------------------------------
        // HIGHEST K/D
        // -----------------------------------------------------

        double highestKD = matches.stream()
                .mapToDouble(match -> {

                    int kills = match.getKills() != null
                            ? match.getKills()
                            : 0;

                    int deaths = match.getDeaths() != null
                            ? match.getDeaths()
                            : 0;

                    if (deaths == 0) {
                        return kills;
                    }

                    return (double) kills / deaths;
                })
                .max()
                .orElse(0);


        // -----------------------------------------------------
        // AVERAGE SCORE
        // -----------------------------------------------------

        double averageScore = matches.stream()
                .mapToInt(match ->
                        match.getScore() != null
                                ? match.getScore()
                                : 0
                )
                .average()
                .orElse(0);


        // -----------------------------------------------------
        // WIN RATE
        // -----------------------------------------------------

        double winRate = totalMatches > 0
                ? ((double) wins / totalMatches) * 100
                : 0;


        // -----------------------------------------------------
        // TOTAL K/D RATIO
        // -----------------------------------------------------

        double kdRatio = totalDeaths > 0
                ? (double) totalKills / totalDeaths
                : totalKills;


        // -----------------------------------------------------
        // RETURN ANALYTICS
        // -----------------------------------------------------

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