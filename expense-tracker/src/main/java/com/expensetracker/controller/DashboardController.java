package com.expensetracker.controller;

import com.expensetracker.dto.CategoryBreakdownResponse;
import com.expensetracker.dto.DashboardSummaryResponse;
import com.expensetracker.service.DashboardService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse getSummary(Authentication authentication) {
        return dashboardService.getSummary(authentication.getName());
    }

    @GetMapping("/categories")
    public CategoryBreakdownResponse getCategories(Authentication authentication) {
        return dashboardService.getCategoryBreakdown(authentication.getName());
    }
}
