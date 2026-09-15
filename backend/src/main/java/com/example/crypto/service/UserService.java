package com.example.crypto.service;

import org.springframework.stereotype.Service;

import com.example.crypto.model.User;
import com.example.crypto.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
}