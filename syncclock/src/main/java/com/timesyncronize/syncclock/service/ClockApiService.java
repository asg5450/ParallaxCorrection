package com.timesyncronize.syncclock.service;

import com.timesyncronize.syncclock.model.request.BrowserWasTimeSyncRequest;
import com.timesyncronize.syncclock.model.response.BrowserWasTimeSyncResponse;
import org.springframework.stereotype.Service;

@Service
public class ClockApiService {

    public BrowserWasTimeSyncResponse<Long> nowResponse(BrowserWasTimeSyncRequest<Long> request){
        return new BrowserWasTimeSyncResponse<Long>(request.getBrowserBefore(), System.currentTimeMillis());
    }
}
