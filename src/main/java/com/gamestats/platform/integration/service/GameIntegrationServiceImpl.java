package com.gamestats.platform.integration.service;

import com.gamestats.platform.integration.dto.CompareResponse;
import com.gamestats.platform.integration.dto.ConnectResponse;
import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import com.gamestats.platform.integration.provider.GameProvider;
import com.gamestats.platform.model.ConnectedAccount;
import com.gamestats.platform.model.GameMatch;
import com.gamestats.platform.repository.ConnectedAccountRepository;
import com.gamestats.platform.repository.GameMatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GameIntegrationServiceImpl
        implements GameIntegrationService {

    private final List<GameProvider> gameProviders;

    private final GameMatchRepository gameMatchRepository;

    private final ConnectedAccountRepository connectedAccountRepository;


    // =========================================================
    // GET PLAYER STATS
    // =========================================================

    @Override
    public GamePlayerStatsResponse getPlayerStats(
            String game,
            String playerName) {

        GameProvider provider = findProvider(game);

        return provider.getPlayerStats(playerName);
    }


    // =========================================================
    // COMPARE PLAYERS
    // =========================================================

    @Override
    public CompareResponse comparePlayers(
            String game,
            String player1,
            String player2) {

        GameProvider provider = findProvider(game);

        GamePlayerStatsResponse stats1 =
                provider.getPlayerStats(player1);

        GamePlayerStatsResponse stats2 =
                provider.getPlayerStats(player2);

        CompareResponse response = new CompareResponse();

        response.setPlayer1(stats1);

        response.setPlayer2(stats2);

        response.setBetterPlayer(
                stats1.getKd() >= stats2.getKd()
                        ? player1
                        : player2
        );

        return response;
    }


    // =========================================================
    // CONNECT GAME
    // =========================================================

    @Override
    public ConnectResponse connectGame(
            String username,
            String game,
            String playerName
    ) {

        if (playerName == null || playerName.isBlank()) {
            throw new IllegalArgumentException(
                    "Player name cannot be empty"
            );
        }

        GameProvider provider = findProvider(game);

        if (!provider.supportsConnection()) {
            throw new IllegalArgumentException(
                    "Online connection is not supported for " + game
            );
        }

        String normalizedGame = provider.getGameName();

        List<GameMatch> matches =
                provider.getMatches(playerName);

        ConnectedAccount account =
                connectedAccountRepository
                        .findByUsernameAndGame(
                                username,
                                normalizedGame
                        )
                        .orElse(null);


        /*
         * If the user previously connected another account,
         * remove ONLY that old account's API matches.
         *
         * Manual matches are never removed.
         */
        if (account != null) {

            String oldAccount =
                    account.getAccountName();

            if (oldAccount != null &&
                    !oldAccount.equalsIgnoreCase(playerName)) {

                gameMatchRepository.deleteByPlayerUsernameAndGameNameAndSourceAndConnectedAccount(
                        username,
                        getDisplayGameName(provider.getGameName()),
                        "API",
                        oldAccount
                );
            }
        }


        // =====================================================
        // SAVE MATCHES
        // =====================================================

        int importedMatches = 0;

        for (GameMatch match : matches) {

            /*
             * Ownership comes from the authenticated user.
             */
            match.setPlayerUsername(username);

            /*
             * These are API-imported matches.
             */
            match.setSource("API");

            /*
             * Store the exact connected game account.
             */
            match.setConnectedAccount(playerName);


            /*
             * Do not import the same external match twice.
             */
            boolean alreadyExists =
                    gameMatchRepository
                            .existsByPlayerUsernameAndGameNameAndExternalMatchId(
                                    username,
                                    match.getGameName(),
                                    match.getExternalMatchId()
                            );


            if (!alreadyExists) {

                gameMatchRepository.save(match);

                importedMatches++;
            }
        }


        // =====================================================
        // SAVE CONNECTED ACCOUNT
        // =====================================================

        if (account == null) {
            account = new ConnectedAccount();
        }

        account.setUsername(username);

        account.setGame(normalizedGame);

        account.setAccountName(playerName);

        account.setConnected(true);

        account.setConnectedAt(LocalDateTime.now());

        connectedAccountRepository.save(account);


        // =====================================================
        // RESPONSE
        // =====================================================

        return new ConnectResponse(
                game,
                playerName,
                importedMatches,
                true,
                "Game connected successfully"
        );
    }


    // =========================================================
    // DISCONNECT GAME
    // =========================================================

    @Override
    public void disconnectGame(String username, String game) {

        if (game == null || game.isBlank()) {
            throw new IllegalArgumentException("Game cannot be empty");
        }

        GameProvider provider = findProvider(game);

        String normalizedGame = provider.getGameName();

        String displayGameName;

        switch (normalizedGame.toLowerCase()) {
            case "pubg" -> displayGameName = "PUBG";
            case "leagueoflegends" -> displayGameName = "League of Legends";
            case "tft" -> displayGameName = "Teamfight Tactics";
            default -> throw new IllegalArgumentException(
                    "Disconnect is not supported for " + game
            );
        }

        connectedAccountRepository
                .findByUsernameAndGame(username, normalizedGame)
                .ifPresent(account -> {

                    String connectedAccount = account.getAccountName();

                    if (connectedAccount != null) {

                        gameMatchRepository
                                .deleteByPlayerUsernameAndGameNameAndSourceAndConnectedAccount(
                                        username,
                                        displayGameName,
                                        "API",
                                        connectedAccount
                                );
                    }

                    connectedAccountRepository.deleteByUsernameAndGame(
                            username,
                            normalizedGame
                    );
                });
    }


    // =========================================================
    // FIND PROVIDER
    // =========================================================

    private GameProvider findProvider(String game) {

        if (game == null || game.isBlank()) {
            throw new IllegalArgumentException(
                    "Game cannot be empty"
            );
        }

        return gameProviders.stream()
                .filter(provider ->
                        provider.getGameName()
                                .equalsIgnoreCase(game))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Unsupported game: " + game
                        ));
    }
    @Override
    public List<ConnectedAccount> getConnectedGames(String username) {

        return connectedAccountRepository.findByUsername(username)
                .stream()
                .filter(ConnectedAccount::isConnected)
                .toList();
    }

    private String getDisplayGameName(String normalizedGame) {

        return switch (normalizedGame.toLowerCase()) {

            case "pubg" ->
                    "PUBG";

            case "leagueoflegends" ->
                    "League of Legends";

            case "tft" ->
                    "Teamfight Tactics";

            default ->
                    throw new IllegalArgumentException(
                            "Unsupported online game: "
                                    + normalizedGame
                    );
        };
    }
}