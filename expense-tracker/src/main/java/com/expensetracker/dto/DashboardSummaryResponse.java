package com.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardSummaryResponse {

    private double totalIncome;
    private double totalExpense;
    private double balance;
}
