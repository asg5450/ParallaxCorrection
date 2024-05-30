package com.timesyncronize.syncclock;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class SyncclockApplication {

    // war 배포를 위해 SpringBootServletInitializer 상속

    // war 배포를 위해 오버라이딩
//    @Override
//    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
//        return builder.sources(SyncclockApplication.class);
//    }

    public static void main(String[] args) {
        SpringApplication.run(SyncclockApplication.class, args);
    }

}
