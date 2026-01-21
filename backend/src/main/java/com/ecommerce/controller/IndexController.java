package com.ecommerce.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

    @GetMapping("/")
    public String index() {
        return "forward:/index.html";
    }

    @GetMapping("/login")
    public String login() {
        return "forward:/index.html";
    }

    @GetMapping("/register")
    public String register() {
        return "forward:/index.html";
    }

    @GetMapping("/products")
    public String products() {
        return "forward:/index.html";
    }

    @GetMapping("/categories")
    public String categories() {
        return "forward:/index.html";
    }

    @GetMapping("/cart")
    public String cart() {
        return "forward:/index.html";
    }

    @GetMapping("/checkout")
    public String checkout() {
        return "forward:/index.html";
    }

    @GetMapping("/orders")
    public String orders() {
        return "forward:/index.html";
    }

    @GetMapping("/profile")
    public String profile() {
        return "forward:/index.html";
    }

    @GetMapping("/notifications")
    public String notifications() {
        return "forward:/index.html";
    }
}
