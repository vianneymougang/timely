package com.timely.notificationservice.document;

import com.timely.notificationservice.document.enums.TypeNotification;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "templates")
@Getter
@Setter
@NoArgsConstructor
public class Template {

    @Id
    private String id;

    private String nom;

    private TypeNotification typeNotification;

    private String contenuTemplate;

    private List<String> variablesDisponibles;

    private Boolean actif;

    private LocalDateTime dateCreation;

    private LocalDateTime dateModification;
}
