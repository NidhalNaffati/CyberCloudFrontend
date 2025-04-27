package com.buzzsocial;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
@EnableWebMvc
public class BuzzSocialApplication {
    public static void main(String[] args) {
        SpringApplication.run(BuzzSocialApplication.class, args);
    }
}
