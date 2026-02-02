package com.expensetracker.service;

import com.expensetracker.dto.LoginRequest;
import com.expensetracker.dto.RegisterRequest;

public interface UserService {

    void register(RegisterRequest request);

    String login(LoginRequest request);
}
