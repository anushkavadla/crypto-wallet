package com.example.crypto.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.crypto.model.Transaction;
import com.example.crypto.model.User;
import com.example.crypto.model.Wallet;
import com.example.crypto.repository.UserRepository;
import com.example.crypto.service.WalletService;

@RestController
@RequestMapping("/api/wallets")
public class WalletController {

    private final WalletService walletService;
    private final UserRepository userRepository;

    public WalletController(
            WalletService walletService,
            UserRepository userRepository) {

        this.walletService = walletService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Wallet> createWallet(
            Principal principal,
            @RequestBody Wallet wallet) {

        User user = userRepository
                .findByEmail(principal.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        wallet.setUser(user);

        Wallet savedWallet = walletService.saveWallet(wallet);

        return ResponseEntity.ok(savedWallet);
    }

    @GetMapping
    public ResponseEntity<Wallet> getWallet(Principal principal) {

        User user = userRepository
                .findByEmail(principal.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Wallet wallet = walletService
                .getWalletByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Wallet not found"));

        return ResponseEntity.ok(wallet);
    }
    @PostMapping("/transfer")
public ResponseEntity<String> transfer(
        Principal principal,
        @RequestBody java.util.Map<String, Object> request) {

    String receiverEmail = (String) request.get("receiverEmail");

    java.math.BigDecimal amount = new java.math.BigDecimal(
            request.get("amount").toString()
    );

    walletService.transfer(
            principal.getName(),
            receiverEmail,
            amount
    );

    return ResponseEntity.ok("Transfer successful");
}
@GetMapping("/transactions")
public ResponseEntity<java.util.List<Transaction>> getTransactions(
        Principal principal) {

    return ResponseEntity.ok(
            walletService.getTransactionHistory(
                    principal.getName()
            )
    );
}
}