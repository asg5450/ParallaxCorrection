package com.timesyncronize.syncclock.service;

import com.timesyncronize.syncclock.repository.ClockRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;

@AllArgsConstructor
@Service
public class ClockApiService {

    @Autowired
    private final ClockRepository clockRepository;

    @Transactional
    public Long timeDifferenceDB() throws ParseException {

        // WAS Before 시간 확인
        Long wasBefore = System.currentTimeMillis();
        System.out.println(" wasBefore = " + wasBefore);

        // DB에서 현재시간 확인
        LocalDateTime dbNow = clockRepository.now();
        Long dbTimestamp = Timestamp.valueOf(dbNow).getTime();
        System.out.println("dbTimestamp = " + dbTimestamp);

        // WAS After 시간 확인
        Long wasAfter = System.currentTimeMillis();
        System.out.println(" wasAfter = " + wasAfter);

        // WAS <-> DB 요청 소요 시간
        Long sysdateRequestTime = ((wasAfter - wasBefore) / 2);

        System.out.println("질의 요청 소요 시간: " + sysdateRequestTime);

        // WAS <-> DB 시차
        Long result = (dbTimestamp - wasBefore - sysdateRequestTime);
        System.out.println("WAS <-> DB 시간 차이: " + result);

        return result;
    }

    public ArrayList<Long> getSysdate(){

        Long JavaBefore = System.currentTimeMillis();

        // DB에서 현재시간 확인
        LocalDateTime dbNow = clockRepository.now();

        Long dbTimestamp = Timestamp.valueOf(dbNow).getTime();

        Long sysdateRequestTime = ((dbTimestamp - JavaBefore) / 2);

        ArrayList<Long> dbTimeAndQueryResTime = new ArrayList<>();
        dbTimeAndQueryResTime.add(dbTimestamp);
        dbTimeAndQueryResTime.add(sysdateRequestTime);
        dbTimeAndQueryResTime.add(JavaBefore);

        return dbTimeAndQueryResTime;
    }

    public Long justGetDbNow() {
        LocalDateTime dbNow = clockRepository.now();
        Long dbTimestamp = Timestamp.valueOf(dbNow).getTime();
        System.out.println("dbTimestamp = " + dbTimestamp);

        return dbTimestamp;
    }
}
