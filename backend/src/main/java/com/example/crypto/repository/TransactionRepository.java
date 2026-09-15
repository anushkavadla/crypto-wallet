package com.example.crypto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.crypto.model.Transaction;
import com.example.crypto.model.User;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findBySender(User sender);

    List<Transaction> findByReceiver(User receiver);
}