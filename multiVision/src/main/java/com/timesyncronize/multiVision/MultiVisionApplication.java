package com.timesyncronize.multiVision;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MultiVisionApplication {

    // war 배포를 위해 SpringBootServletInitializer 상속

    // war 배포를 위해 오버라이딩
//    @Override
//    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
//        return builder.sources(multiVisionApplication.class);
//    }

    public static void main(String[] args) {
        SpringApplication.run(MultiVisionApplication.class, args);
    }

}
