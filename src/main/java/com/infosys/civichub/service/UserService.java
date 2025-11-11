package com.infosys.civichub.service;

import com.infosys.civichub.model.User;
import com.infosys.civichub.repo.UserRepository;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository repo;
    private final int BCRYPT_ROUNDS = 10;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public String register(String name, String email, String password) {
        if (repo.findByName(name).isPresent())
            return "name_exists";
        if (repo.findByEmail(email).isPresent())
            return "email_exists";
        String salt = BCrypt.gensalt(BCRYPT_ROUNDS);
        String hashed = BCrypt.hashpw(password, salt);
        User u = new User(name, email, hashed);
        repo.save(u);
        return "ok";
    }

    public boolean login(String name, String password) {
        Optional<User> u = repo.findByName(name);
        if (u.isEmpty())
            return false;
        return BCrypt.checkpw(password, u.get().getPasswordHash());
    }
}
