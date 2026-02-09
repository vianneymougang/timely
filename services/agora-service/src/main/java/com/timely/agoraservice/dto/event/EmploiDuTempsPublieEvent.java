package com.timely.agoraservice.dto.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmploiDuTempsPublieEvent {
    private UUID emploiDuTempsId;
    private String titre;
    private LocalDateTime datePublication;
    private UUID ecoleId;
    private String publisherEmail;
}
