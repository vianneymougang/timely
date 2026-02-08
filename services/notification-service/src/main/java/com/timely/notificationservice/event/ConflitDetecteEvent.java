package com.timely.notificationservice.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConflitDetecteEvent implements Serializable {

    private UUID conflitId;
    private UUID emploiDuTempsId;
    private String typeConflit;
    private String severite;
    private String description;
    private LocalDateTime dateDetection;
}
