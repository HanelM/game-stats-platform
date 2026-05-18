package com.gamestats.platform.integration.service;

import com.gamestats.platform.integration.entity.ComparisonHistory;
import org.springframework.data.domain.Page;
import com.gamestats.platform.integration.dto.ComparisonHistoryResponse;




public interface ComparisonHistoryService {

    ComparisonHistory saveComparison(
            ComparisonHistory comparisonHistory
    );

    Page<ComparisonHistoryResponse> getUserHistory(
            String username,
            int page,
            int size
    );

}