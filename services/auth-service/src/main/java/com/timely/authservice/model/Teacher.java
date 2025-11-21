package com.timely.authservice.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;

@Entity
@DiscriminatorValue("TEACHER")
@Getter
@Setter
@NoArgsConstructor
public class Teacher extends User {
    @Column(unique = true)
    private String matricule;

    @NotNull
    private String grade;

    @NotNull
    private String rank;

    @NotNull
    private String hourlyRate;
}
