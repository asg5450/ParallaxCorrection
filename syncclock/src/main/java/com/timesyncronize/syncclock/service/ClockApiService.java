package com.timesyncronize.syncclock.service;

import com.timesyncronize.syncclock.model.request.BrowserWasTimeSyncRequest;
import com.timesyncronize.syncclock.model.request.DatabaseTimeRequest;
import com.timesyncronize.syncclock.model.response.BrowserWasTimeSyncResponse;
import com.timesyncronize.syncclock.model.response.DatabaseTimeResponse;
import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ClockApiService {
    private JdbcTemplate jdbcTemplate;
    public BrowserWasTimeSyncResponse<Long> nowResponse(BrowserWasTimeSyncRequest<Long> request){
        return new BrowserWasTimeSyncResponse<Long>(request.getBrowserBefore(), System.currentTimeMillis());
    }

    public DatabaseTimeResponse<Long> timeDifferenceDB(DatabaseTimeRequest<Long> request){
        //Long wasBefore = System.currentTimeMillis();
        Long dbNow = jdbcTemplate.queryForObject("select UNIX_TIMESTAMP(sysdate()) * 1000;" ,Long.class);
        return new DatabaseTimeResponse<Long>(request.getWasBefore(), dbNow);
    }
}
