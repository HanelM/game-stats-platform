package com.gamestats.platform.integration.repository;

import com.gamestats.platform.integration.entity.ComparisonHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ComparisonHistoryRepository
        extends MongoRepository<ComparisonHistory, String> {

    Page<ComparisonHistory> findByUsername(
            String username,
            Pageable pageable
    );
}