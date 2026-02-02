package com.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Map;

@Getter
@AllArgsConstructor
public class CategoryBreakdownResponse {

    private Map<String, Double> categories;
}
