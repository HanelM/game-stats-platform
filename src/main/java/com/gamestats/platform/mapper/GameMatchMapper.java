package com.gamestats.platform.mapper;

import com.gamestats.platform.dto.GameMatchResponse;
import com.gamestats.platform.model.GameMatch;

public class GameMatchMapper {

    public static GameMatchResponse toResponse(
            GameMatch match
    ) {

        return GameMatchResponse.builder()

                .id(match.getId())

                .gameName(match.getGameName())

                .score(match.getScore())

                .kills(match.getKills())

                .deaths(match.getDeaths())

                .win(match.getWin())

                .playedAt(match.getPlayedAt())

                /* PUBG */
                .placement(match.getPlacement())
                .damage(match.getDamage())
                .survivalTime(match.getSurvivalTime())

                /* CS2 / VALORANT */
                .assists(match.getAssists())
                .headshots(match.getHeadshots())

                /* VALORANT */
                .combatScore(match.getCombatScore())

                /* LOL */
                .cs(match.getCs())
                .gold(match.getGold())

                .build();
    }
}