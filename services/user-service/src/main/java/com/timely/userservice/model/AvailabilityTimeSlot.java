package com.timely.userservice.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity representing a single time slot in a teacher's availability
 */
@Entity
@Table(name = "availability_time_slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityTimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "availability_id", nullable = false)
    private TeacherAvailability availability;

    @Column(name = "day_of_week", nullable = false, length = 20)
    @NotNull
    private String dayOfWeek;

    @Column(name = "hour_start", nullable = false)
    @NotNull
    @Min(8)
    @Max(16)
    private Integer hourStart;

    @Column(name = "hour_end", nullable = false)
    @NotNull
    @Min(9)
    @Max(17)
    private Integer hourEnd;

    /**
     * Constructor without ID for creating new slots
     */
    public AvailabilityTimeSlot(String dayOfWeek, Integer hourStart, Integer hourEnd) {
        this.dayOfWeek = dayOfWeek;
        this.hourStart = hourStart;
        this.hourEnd = hourEnd;
    }
}
