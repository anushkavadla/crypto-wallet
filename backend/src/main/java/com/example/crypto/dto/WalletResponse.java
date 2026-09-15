package com.example.crypto.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class WalletResponse {

    private Long id;
    private BigDecimal balance;
    private String userName;
    private String email;
}