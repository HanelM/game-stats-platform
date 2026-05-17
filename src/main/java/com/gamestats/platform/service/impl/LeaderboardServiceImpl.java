package com.gamestats.platform.service.impl;

import com.gamestats.platform.model.GameMatch;
import com.gamestats.platform.repository.GameMatchRepository;
import com.gamestats.platform.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardServiceImpl implements LeaderboardService {

    private final GameMatchRepository gameMatchRepository;

    @Override
    public List<Map<String, Object>> getLeaderboard() {

        List<GameMatch> matches = gameMatchRepository.findAll();

        Map<String, List<GameMatch>> grouped =
                matches.stream().collect(Collectors.groupingBy(GameMatch::getPlayerUsername));

        List<Map<String, Object>> result = new ArrayList<>();

        for (String username : grouped.keySet()) {

            List<GameMatch> userMatches = grouped.get(username);

            int kills = userMatches.stream().mapToInt(GameMatch::getKills).sum();
            int wins = (int) userMatches.stream().filter(GameMatch::getWin).count();

            Map<String, Object> row = new HashMap<>();
            row.put("username", username);
            row.put("kills", kills);
            row.put("wins", wins);

            result.add(row);
        }

        result.sort((a, b) ->
                Integer.compare((int) b.get("kills"), (int) a.get("kills")));

        return result;
    }
}