package com.gamestats.platform.integration.mapper;

import com.gamestats.platform.integration.dto.ComparisonHistoryResponse;
import com.gamestats.platform.integration.entity.ComparisonHistory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ComparisonHistoryMapper {

    ComparisonHistoryResponse toResponse(ComparisonHistory entity);
}