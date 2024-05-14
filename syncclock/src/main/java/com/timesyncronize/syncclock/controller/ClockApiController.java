package com.timesyncronize.syncclock.controller;

import com.timesyncronize.syncclock.service.ClockApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/clockRest")
@RequiredArgsConstructor
public class ClockApiController {

    private final ClockApiService clockApiService;

    @PostMapping("/wasNow")
    public Long nowResponse(){
        return System.currentTimeMillis();
    }

    @PostMapping("/dbNow")
    public Long timeDifferenceDB(){
        return clockApiService.timeDifferenceDB();
    }
}
