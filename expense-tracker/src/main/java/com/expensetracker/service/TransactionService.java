package com.expensetracker.service;

import com.expensetracker.dto.TransactionRequest;
import com.expensetracker.entity.Transaction;

import java.util.List;

public interface TransactionService {

    void addTransaction(TransactionRequest request, String userEmail);

    List<Transaction> getUserTransactions(String userEmail);

    void updateTransaction(Long id, TransactionRequest request, String userEmail);

    void deleteTransaction(Long id, String userEmail);
}