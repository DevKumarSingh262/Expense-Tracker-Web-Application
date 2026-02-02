package com.expensetracker.service;

import com.expensetracker.dto.TransactionRequest;
import com.expensetracker.entity.Transaction;
import com.expensetracker.entity.User;
import com.expensetracker.repository.TransactionRepository;
import com.expensetracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository,
                                  UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void addTransaction(TransactionRequest request, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = new Transaction();
        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setType(request.getType());
        transaction.setDate(request.getDate());
        transaction.setUser(user);

        transactionRepository.save(transaction);
    }

    @Override
    public List<Transaction> getUserTransactions(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return transactionRepository.findByUser(user);
    }

    @Override
    public void updateTransaction(Long id, TransactionRequest request, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Verify the transaction belongs to the user
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to transaction");
        }

        // Update transaction fields
        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setType(request.getType());
        transaction.setDate(request.getDate());

        transactionRepository.save(transaction);
    }

    @Override
    public void deleteTransaction(Long id, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Verify the transaction belongs to the user
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to transaction");
        }

        transactionRepository.delete(transaction);
    }
}