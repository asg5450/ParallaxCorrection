package nsoftware.parallaxcorrection.parallaxcorrection.service;

import org.springframework.stereotype.Service;

import java.util.Calendar;

@Service
public class ClockApiService {

    public Long nowResponse(){

        Long wasNow = System.currentTimeMillis();

        return wasNow;
    }
}
