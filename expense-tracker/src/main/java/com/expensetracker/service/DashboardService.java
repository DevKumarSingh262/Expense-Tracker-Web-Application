package com.expensetracker.service;

import com.expensetracker.dto.CategoryBreakdownResponse;
import com.expensetracker.dto.DashboardSummaryResponse;

public interface DashboardService {

    DashboardSummaryResponse getSummary(String userEmail);

    CategoryBreakdownResponse getCategoryBreakdown(String userEmail);
}
