package com.timesyncronize.syncclock.controller;

import com.timesyncronize.syncclock.model.request.BrowserWasTimeSyncRequest;
import com.timesyncronize.syncclock.model.request.DatabaseTimeRequest;
import com.timesyncronize.syncclock.model.response.BrowserWasTimeSyncResponse;
import com.timesyncronize.syncclock.model.response.DatabaseTimeResponse;
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
    public Long timeDifferenceDB(DatabaseTimeRequest<Long> request){
        request.setWasBefore(System.currentTimeMillis());
        System.out.println("db 요청 전: " + request.getWasBefore());

        DatabaseTimeResponse<Long> dbDate = clockApiService.timeDifferenceDB(request);
        System.out.println("db: " + dbDate);

//        long wasAfter = System.currentTimeMillis();
//        System.out.println("db 요청 후: " + wasAfter);

        Long sysdateDifference = ((System.currentTimeMillis() - dbDate.getWasBefore()) / 2);
        System.out.println("질의 요청 소요 시간: " + sysdateDifference);
        
        Long result = (dbDate.getDbNow() - dbDate.getWasBefore() - sysdateDifference);
        System.out.println("was-db 시간 차이: " + result);
        return result;
    }
}
