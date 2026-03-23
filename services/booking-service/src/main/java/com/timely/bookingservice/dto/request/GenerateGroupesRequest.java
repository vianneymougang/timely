package com.timely.bookingservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for automatic group generation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenerateGroupesRequest {

    /**
     * Optional: Number of students per group.
     * If not specified, default based on course type:
     * - CM: 1 group (entire class)
     * - TD: 2 groups
     * - TP: 3 groups
     */
    private Integer nombreGroupes;
}
