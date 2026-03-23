package com.timely.planningservice.config;

import java.time.LocalTime;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for planning generation algorithm
 */
@Configuration
@ConfigurationProperties(prefix = "planning.generation")
@Getter
@Setter
public class PlanningGenerationConfig {

    /**
     * Maximum duration for generation process in milliseconds
     */
    private long maxDureeGenerationMs = 60000L; // 60 seconds default

    /**
     * Default start time for daily schedule
     */
    private LocalTime heureDebutDefaut = LocalTime.of(8, 0);

    /**
     * Default end time for daily schedule
     */
    private LocalTime heureFinDefaut = LocalTime.of(17, 0);

    /**
     * Default duration of a time slot in minutes
     */
    private int dureeCreneauDefaut = 120;

    /**
     * Default pause between time slots in minutes
     */
    private int pauseDefaut = 15;

    /**
     * Default number of time slots per day
     */
    private int creneauxParJourDefaut = 4;

    /**
     * Bonus score for grouping course sessions on same day
     */
    private int scoreRegroupementJour = 50;

    /**
     * Bonus score for CM in morning hours
     */
    private int scoreCmMatin = 40;

    /**
     * Penalty score for late afternoon slots
     */
    private int penaliteCreneauTardif = 20;

    /**
     * Bonus score for balanced week load
     */
    private int scoreEquilibrageJour = 30;

    /**
     * Bonus score for mid-week days (Tue-Thu)
     */
    private int scoreMilieuSemaine = 10;
}
