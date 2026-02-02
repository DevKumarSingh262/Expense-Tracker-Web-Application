package com.expensetracker.service;

import com.expensetracker.dto.CategoryBreakdownResponse;
import com.expensetracker.dto.DashboardSummaryResponse;
import com.expensetracker.entity.TransactionType;
import com.expensetracker.entity.User;
import com.expensetracker.repository.TransactionRepository;
import com.expensetracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public DashboardServiceImpl(TransactionRepository transactionRepository,
                                UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @Override
    public DashboardSummaryResponse getSummary(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Double income = transactionRepository.sumByType(user, TransactionType.INCOME);
        Double expense = transactionRepository.sumByType(user, TransactionType.EXPENSE);

        double totalIncome = income != null ? income : 0.0;
        double totalExpense = expense != null ? expense : 0.0;

        double balance = totalIncome - totalExpense;

        return new DashboardSummaryResponse(totalIncome, totalExpense, balance);
    }

    @Override
    public CategoryBreakdownResponse getCategoryBreakdown(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Object[]> results = transactionRepository.sumByCategory(user);

        Map<String, Double> categoryMap = new HashMap<>();

        for (Object[] row : results) {
            String category = (String) row[0];
            Double amount = (Double) row[1];
            categoryMap.put(category, amount);
        }

        return new CategoryBreakdownResponse(categoryMap);
    }
}
