package com.aihref;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AihrefBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(AihrefBackendApplication.class, args);
	}

}
