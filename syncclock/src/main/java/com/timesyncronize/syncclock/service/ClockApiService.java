package com.timesyncronize.syncclock.service;

import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@AllArgsConstructor
@Service
public class ClockApiService {

    private JdbcTemplate jdbcTemplate;

    public Long timeDifferenceDB() throws ParseException {

        // WAS Before 시간 확인
        Long wasBefore = System.currentTimeMillis();

        // DB에서 현재시간 확인
        String getDbNow = jdbcTemplate.queryForObject("select NOW();" ,String.class);

        // 포맷 형식 지정
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        // 문자열 -> Date
        Date date = formatter.parse(getDbNow);

        // Date -> Milliseconds
        Long dbNowMilli = date.toInstant().toEpochMilli();
        System.out.println("DB NOW: " + dbNowMilli);

        // WAS After 시간 확인
        Long wasAfter = System.currentTimeMillis();

        // WAS <-> DB 요청 소요 시간
        Long sysdateRequestTime = ((wasAfter - wasBefore) / 2);

        // 디버깅 출력문
        System.out.println(" wasBefore = " + wasBefore);
        System.out.println(" dbNow = " + getDbNow);
        System.out.println(" wasAfter = " + wasAfter);
        System.out.println("질의 요청 소요 시간: " + sysdateRequestTime);

        // WAS <-> DB 시차
        Long result = (dbNowMilli - wasBefore - sysdateRequestTime);
        System.out.println("WAS <-> DB 시간 차이: " + result);

        return result;
    }
}
