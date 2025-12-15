package hu.unideb.inf.randiapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {
    
    @GetMapping(value = { "/login", "/register", "/dashboard", "/profile" })
    public String forwardToReact() {
        return "forward:/index.html";
    }
}
