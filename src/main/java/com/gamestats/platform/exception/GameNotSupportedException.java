package com.gamestats.platform.exception;

public class GameNotSupportedException
        extends RuntimeException {

    public GameNotSupportedException(
            String message
    ) {
        super(message);
    }
}