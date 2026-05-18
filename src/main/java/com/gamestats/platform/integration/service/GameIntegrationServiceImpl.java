package com.gamestats.platform.integration.service;

import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import com.gamestats.platform.integration.provider.GameProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GameIntegrationServiceImpl
        implements GameIntegrationService {

    private final List<GameProvider> providers;

    @Override
    public GamePlayerStatsResponse getPlayerStats(
            String game,
            String playerName
    ) {

        for(GameProvider provider : providers){

            if(
                    provider.getGameName()
                            .equalsIgnoreCase(game)
            ){

                return provider.getPlayerStats(
                        playerName
                );
            }
        }

        throw new RuntimeException(
                "Game not supported"
        );
    }
}