package com.infosys.civichub.controller;

import com.infosys.civichub.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:5173}")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        String res = userService.register(name, email, password);
        if ("ok".equals(res))
            return ResponseEntity.ok(Map.of("status", "success"));
        if ("name_exists".equals(res))
            return ResponseEntity.badRequest().body(Map.of("status", "fail", "message", "Name exists"));
        if ("email_exists".equals(res))
            return ResponseEntity.badRequest().body(Map.of("status", "fail", "message", "Email exists"));
        return ResponseEntity.internalServerError().body(Map.of("status", "fail", "message", "error"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String password = body.get("password");
        boolean ok = userService.login(name, password);
        if (ok)
            return ResponseEntity.ok(Map.of("status", "success"));
        else
            return ResponseEntity.status(401).body(Map.of("status", "fail", "message", "Invalid credentials"));
    }
}
