package com.gamestats.platform.integration.service;

import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import com.gamestats.platform.integration.provider.GameProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import com.gamestats.platform.integration.dto.CompareResponse;

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
    @Override
    public CompareResponse comparePlayers(
            String game,
            String player1,
            String player2
    ) {

        GamePlayerStatsResponse stats1 =
                getPlayerStats(game, player1);

        GamePlayerStatsResponse stats2 =
                getPlayerStats(game, player2);

        CompareResponse response =
                new CompareResponse();

        response.setPlayer1(stats1);

        response.setPlayer2(stats2);

        if(stats1.getKd() > stats2.getKd()){

            response.setBetterPlayer(
                    stats1.getPlayerName()
            );
        }
        else if(stats2.getKd() > stats1.getKd()){

            response.setBetterPlayer(
                    stats2.getPlayerName()
            );
        }
        else{

            response.setBetterPlayer("Equal");
        }

        return response;
    }
}