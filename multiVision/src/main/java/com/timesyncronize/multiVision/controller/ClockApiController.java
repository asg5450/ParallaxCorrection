package com.timesyncronize.multiVision.controller;

import com.timesyncronize.multiVision.service.ClockApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

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
    public Long timeDifferenceDB() throws ParseException {
        return clockApiService.timeDifferenceDB();
    }

    @PostMapping("/dbSysdateGet")
    public ArrayList<Long> dbSysdateGet() throws ParseException {
        return clockApiService.getSysdate();
    }

    @PostMapping("/jsToDb")
    public Long jsToDb() throws ParseException {
        return clockApiService.justGetDbNow();
    }
}
