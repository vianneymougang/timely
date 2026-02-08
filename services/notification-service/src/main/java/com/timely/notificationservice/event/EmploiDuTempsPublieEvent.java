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
public class EmploiDuTempsPublieEvent implements Serializable {

    private UUID emploiDuTempsId;
    private UUID ecoleId;
    private LocalDateTime datePublication;
    private String periode;
    private String utilisateurValidation;
}
