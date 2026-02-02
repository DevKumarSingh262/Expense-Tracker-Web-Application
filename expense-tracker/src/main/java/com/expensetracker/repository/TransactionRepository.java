package com.expensetracker.repository;

import com.expensetracker.entity.Transaction;
import com.expensetracker.entity.TransactionType;
import com.expensetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUser(User user);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type = :type")
    Double sumByType(User user, TransactionType type);

    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t WHERE t.user = :user GROUP BY t.category")
    List<Object[]> sumByCategory(User user);
}
