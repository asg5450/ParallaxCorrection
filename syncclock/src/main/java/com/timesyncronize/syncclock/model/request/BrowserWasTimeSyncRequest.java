package com.timesyncronize.syncclock.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BrowserWasTimeSyncRequest<T> {
    private T browserBefore;
}
