package com.example.crypto.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.crypto.model.Transaction;
import com.example.crypto.model.User;
import com.example.crypto.model.Wallet;
import com.example.crypto.repository.TransactionRepository;
import com.example.crypto.repository.UserRepository;
import com.example.crypto.repository.WalletRepository;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public WalletService(
            WalletRepository walletRepository,
            UserRepository userRepository,
            TransactionRepository transactionRepository) {

        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    public Wallet saveWallet(Wallet wallet) {
        return walletRepository.save(wallet);
    }

    public Optional<Wallet> getWalletByUserId(Long userId) {
        return walletRepository.findByUserId(userId);
    }

    @Transactional
    public void transfer(
            String senderEmail,
            String receiverEmail,
            BigDecimal amount) {

        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() ->
                        new RuntimeException("Sender not found"));

        User receiver = userRepository.findByEmail(receiverEmail)
                .orElseThrow(() ->
                        new RuntimeException("Receiver not found"));

        Wallet senderWallet = walletRepository
                .findByUserId(sender.getId())
                .orElseThrow(() ->
                        new RuntimeException("Sender wallet not found"));

        Wallet receiverWallet = walletRepository
                .findByUserId(receiver.getId())
                .orElseThrow(() ->
                        new RuntimeException("Receiver wallet not found"));

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException(
                    "Amount must be greater than zero");
        }

        if (senderWallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException(
                    "Insufficient balance");
        }

        senderWallet.setBalance(
                senderWallet.getBalance().subtract(amount));

        receiverWallet.setBalance(
                receiverWallet.getBalance().add(amount));

        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        Transaction transaction = new Transaction();

        transaction.setSender(sender);
        transaction.setReceiver(receiver);
        transaction.setAmount(amount);

        transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionHistory(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<Transaction> sent =
                transactionRepository.findBySender(user);

        List<Transaction> received =
                transactionRepository.findByReceiver(user);

        sent.addAll(received);

        return sent;
    }
}