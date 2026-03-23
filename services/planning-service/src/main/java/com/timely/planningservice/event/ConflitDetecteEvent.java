package com.timely.planningservice.event;

import java.util.UUID;

import com.timely.planningservice.entity.enums.Severite;
import com.timely.planningservice.entity.enums.TypeConflit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConflitDetecteEvent {

    private UUID conflitId;
    private UUID emploiDuTempsId;
    private TypeConflit typeConflit;
    private Severite severite;
    private String description;
}
