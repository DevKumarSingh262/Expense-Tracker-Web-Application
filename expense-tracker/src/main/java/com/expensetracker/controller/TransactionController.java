package com.expensetracker.controller;

import com.expensetracker.dto.TransactionRequest;
import com.expensetracker.entity.Transaction;
import com.expensetracker.service.TransactionService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public String addTransaction(@RequestBody TransactionRequest request,
                                 Authentication authentication) {

        String userEmail = authentication.getName();
        transactionService.addTransaction(request, userEmail);
        return "Transaction added successfully";
    }

    @GetMapping
    public List<Transaction> getTransactions(Authentication authentication) {

        String userEmail = authentication.getName();
        return transactionService.getUserTransactions(userEmail);
    }

    @PutMapping("/{id}")
    public String updateTransaction(@PathVariable Long id,
                                    @RequestBody TransactionRequest request,
                                    Authentication authentication) {

        String userEmail = authentication.getName();
        transactionService.updateTransaction(id, request, userEmail);
        return "Transaction updated successfully";
    }

    @DeleteMapping("/{id}")
    public String deleteTransaction(@PathVariable Long id,
                                    Authentication authentication) {

        String userEmail = authentication.getName();
        transactionService.deleteTransaction(id, userEmail);
        return "Transaction deleted successfully";
    }
}