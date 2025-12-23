package com.timely.userservice.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class AdminDto extends UserDto {
    private Integer accessLevel;
    private Integer department;
}
