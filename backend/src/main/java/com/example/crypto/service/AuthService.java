package com.example.crypto.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.crypto.dto.LoginRequest;
import com.example.crypto.dto.SignupRequest;
import com.example.crypto.dto.UserResponse;
import com.example.crypto.model.Login;
import com.example.crypto.model.User;
import com.example.crypto.model.Wallet;
import com.example.crypto.repository.LoginRepository;
import com.example.crypto.repository.UserRepository;
import com.example.crypto.repository.WalletRepository;
import com.example.crypto.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final LoginRepository loginRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                   LoginRepository loginRepository,
                   WalletRepository walletRepository,
                   PasswordEncoder passwordEncoder,
                   JwtService jwtService) {

        this.userRepository = userRepository;
        this.loginRepository = loginRepository;
        this.walletRepository = walletRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public UserResponse signup(SignupRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        LocalDateTime now = LocalDateTime.now();

        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        user = userRepository.save(user);
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        wallet.setBalance(BigDecimal.ZERO);
        walletRepository.save(wallet);

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());

        return response;
    }

    public UserResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        Login login = new Login();

        login.setUser(user);
        login.setLoginTime(LocalDateTime.now());

        loginRepository.save(login);

        String token = jwtService.generateToken(user.getEmail());

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setToken(token);

        return response;
    }
}