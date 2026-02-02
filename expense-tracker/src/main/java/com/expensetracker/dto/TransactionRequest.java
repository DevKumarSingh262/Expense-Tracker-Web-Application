package com.expensetracker.dto;

import com.expensetracker.entity.TransactionType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TransactionRequest {

    private String description;
    private double amount;
    private String category;
    private TransactionType type;
    private LocalDate date;
}
