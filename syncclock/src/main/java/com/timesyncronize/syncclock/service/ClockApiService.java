package com.timesyncronize.syncclock.service;

import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ClockApiService {

    private JdbcTemplate jdbcTemplate;

    public Long timeDifferenceDB(){

        // WAS Before 시간 확인
        Long wasBefore = System.currentTimeMillis();

        // DB 시간 확인
        Long dbNow = jdbcTemplate.queryForObject("select UNIX_TIMESTAMP(sysdate());" ,Long.class);

        // WAS After 시간 확인
        Long wasAfter = System.currentTimeMillis();

        // WAS <-> DB 요청 소요 시간
        Long sysdateRequestTime = ((wasAfter - wasBefore) / 2);

        // 디버깅 출력문
        System.out.println(" wasBefore = " + wasBefore);
        System.out.println(" dbNow = " + dbNow);
        System.out.println(" wasAfter = " + wasAfter);
        System.out.println("질의 요청 소요 시간: " + sysdateRequestTime);

        // WAS <-> DB 시차
        Long result = (dbNow - wasBefore - sysdateRequestTime);
        System.out.println("WAS <-> DB 시간 차이: " + result);

        return result;
    }
}
