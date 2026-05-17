package com.gamestats.platform.mapper;

import com.gamestats.platform.dto.GameMatchResponse;
import com.gamestats.platform.model.GameMatch;

public class GameMatchMapper {

    public static GameMatchResponse toResponse(GameMatch match) {

        return GameMatchResponse.builder()
                .id(match.getId())
                .gameName(match.getGameName())
                .score(match.getScore())
                .kills(match.getKills())
                .deaths(match.getDeaths())
                .win(match.getWin())
                .playedAt(match.getPlayedAt())
                .build();
    }
}