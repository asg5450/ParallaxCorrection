package com.timesyncronize.syncclock.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DatabaseTimeResponse<T> {
    private T wasBefore;
    private T dbNow;
}
