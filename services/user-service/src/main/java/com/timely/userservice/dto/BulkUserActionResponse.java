package com.timely.userservice.dto;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BulkUserActionResponse {

    private int successCount;
    private int failureCount;
    private List<UUID> successIds;
    private List<FailedUserAction> failures;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FailedUserAction {
        private UUID userId;
        private String reason;
    }
}
