package com.timesyncronize.multiVision.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("")
public class PageController {

    @GetMapping(path = "")
    public String index(){
        return "index";
    }

    @GetMapping(path = "/double")
    public String iframeDoubleScreen(){
        return "iframeDoubleScreen";
    }

    @GetMapping(path = "/monitor")
    public String timeViewer(){return "javaServerTimeViewer";}
}