package com.timesyncronize.syncclock.controller;

import com.timesyncronize.syncclock.model.request.BrowserWasTimeSyncRequest;
import com.timesyncronize.syncclock.model.response.BrowserWasTimeSyncResponse;
import com.timesyncronize.syncclock.service.ClockApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/clockRest")
@RequiredArgsConstructor
public class ClockApiController {

    private final ClockApiService clockApiService;

    @PostMapping("/wasNow")
    public BrowserWasTimeSyncResponse<Long> nowResponse(@RequestBody BrowserWasTimeSyncRequest<Long> request){
        return clockApiService.nowResponse(request);
    }

    @PostMapping("/dbNow")
    public Long timeDifferenceDB(){
        return clockApiService.timeDifferenceDB();
    }
}
