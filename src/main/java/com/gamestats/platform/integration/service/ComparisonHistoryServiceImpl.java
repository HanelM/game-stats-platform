package com.gamestats.platform.integration.service;

import com.gamestats.platform.integration.dto.ComparisonHistoryResponse;
import com.gamestats.platform.integration.entity.ComparisonHistory;
import com.gamestats.platform.integration.mapper.ComparisonHistoryMapper;
import com.gamestats.platform.integration.repository.ComparisonHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ComparisonHistoryServiceImpl
        implements ComparisonHistoryService {

    private final ComparisonHistoryRepository repository;
    private final ComparisonHistoryMapper mapper;

    @Override
    public ComparisonHistory saveComparison(
            ComparisonHistory comparisonHistory
    ) {
        return repository.save(comparisonHistory);
    }

    @Override
    public Page<ComparisonHistoryResponse> getUserHistory(
            String username,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("comparedAt").descending()
        );

        Page<ComparisonHistory> historyPage =
                repository.findByUsername(username, pageable);

        return historyPage.map(mapper::toResponse);
    }
}