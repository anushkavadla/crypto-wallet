package com.example.crypto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.crypto.model.Login;

public interface LoginRepository extends JpaRepository<Login, Long> {

    List<Login> findByUserId(Long userId);
}