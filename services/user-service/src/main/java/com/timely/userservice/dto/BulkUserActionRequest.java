package com.timely.userservice.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkUserActionRequest {

    @NotEmpty(message = "User IDs list cannot be empty")
    private List<UUID> userIds;
}
