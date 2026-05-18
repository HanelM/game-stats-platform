package com.gamestats.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class GameStatsPlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(GameStatsPlatformApplication.class, args);
	}

}
//     http://localhost:8080/docs/docs.html