package com.gamestats.platform.service.impl;

import com.gamestats.platform.dto.GameMatchRequest;
import com.gamestats.platform.dto.MatchStatsResponse;
import com.gamestats.platform.model.GameMatch;
import com.gamestats.platform.repository.GameMatchRepository;
import com.gamestats.platform.service.GameMatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GameMatchServiceImpl implements GameMatchService {

    private final GameMatchRepository gameMatchRepository;

    @Override
    public GameMatch saveMatch(
            GameMatchRequest request,
            String username
    ) {

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
    public List<GameMatch> getPlayerMatches(String username) {

        return gameMatchRepository.findByPlayerUsername(username);
    }

    @Override
    public MatchStatsResponse getPlayerStats(String username) {

        List<GameMatch> matches =
                gameMatchRepository.findByPlayerUsername(username);

        int totalMatches = matches.size();

        int totalWins = (int) matches.stream()
                .filter(GameMatch::getWin)
                .count();

        int totalLosses = totalMatches - totalWins;

        double winRate = totalMatches == 0
                ? 0
                : ((double) totalWins / totalMatches) * 100;

        return new MatchStatsResponse(
                totalMatches,
                totalWins,
                totalLosses,
                winRate
        );
    }
}