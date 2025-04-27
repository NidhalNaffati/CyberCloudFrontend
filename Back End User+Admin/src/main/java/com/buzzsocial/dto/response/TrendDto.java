package com.buzzsocial.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendDto {
    private String id;
    private String title;
    private LocalDateTime createdAt;
    private Integer totalBuzzScore;
}
