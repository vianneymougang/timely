package com.timely.userservice.model;

/**
 * Enum representing days of the week in French
 */
public enum DayOfWeek {
    LUNDI("lundi"),
    MARDI("mardi"),
    MERCREDI("mercredi"),
    JEUDI("jeudi"),
    VENDREDI("vendredi"),
    SAMEDI("samedi");

    private final String value;

    DayOfWeek(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static DayOfWeek fromValue(String value) {
        for (DayOfWeek day : DayOfWeek.values()) {
            if (day.value.equalsIgnoreCase(value)) {
                return day;
            }
        }
        throw new IllegalArgumentException("Invalid day of week: " + value);
    }
}
