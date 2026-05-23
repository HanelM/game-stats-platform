package com.gamestats.platform.integration.mapper;

import com.gamestats.platform.integration.dto.ComparisonHistoryResponse;
import com.gamestats.platform.integration.entity.ComparisonHistory;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ComparisonHistoryMapper {

    ComparisonHistoryMapper INSTANCE =
            Mappers.getMapper(ComparisonHistoryMapper.class);

    ComparisonHistoryResponse toResponse(ComparisonHistory comparisonHistory);
}