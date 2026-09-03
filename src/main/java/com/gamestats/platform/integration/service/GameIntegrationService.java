package com.gamestats.platform.integration.service;

import com.gamestats.platform.integration.dto.CompareResponse;
import com.gamestats.platform.integration.dto.ConnectResponse;
import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import com.gamestats.platform.model.ConnectedAccount;

import java.util.List;

public interface GameIntegrationService {

    GamePlayerStatsResponse getPlayerStats(
            String game,
            String playerName
    );

    CompareResponse comparePlayers(
            String game,
            String player1,
            String player2
    );

    ConnectResponse connectGame(
            String username,
            String game,
            String playerName
    );

    void disconnectGame(
            String username,
            String game
    );

    List<ConnectedAccount> getConnectedGames(
            String username
    );
}