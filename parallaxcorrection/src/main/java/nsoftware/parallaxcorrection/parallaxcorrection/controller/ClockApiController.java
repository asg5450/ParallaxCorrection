package nsoftware.parallaxcorrection.parallaxcorrection.controller;

import lombok.RequiredArgsConstructor;
import nsoftware.parallaxcorrection.parallaxcorrection.service.ClockApiService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clock")
@RequiredArgsConstructor
public class ClockApiController {

    private final ClockApiService clockApiService;

    @GetMapping("/wasNow")  // http://localhost:8888/api/clock/wasNow
    public Long nowResponse(){
        return clockApiService.nowResponse();
    }
}
