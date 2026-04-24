package com.timely.bookingservice.entity.enums;

public enum CycleType {
    LICENCE,
    MASTER,
    PREPA_INGENIEUR,
    CYCLE_INGENIEUR,
    CPGE,
    PREPA_VOGT;

    public String getDisplayPrefix() {
        return switch (this) {
            case LICENCE -> "L";
            case MASTER -> "M";
            case PREPA_INGENIEUR -> "CP";
            case CYCLE_INGENIEUR -> "CI";
            case CPGE -> "CPGE";
            case PREPA_VOGT -> "PV";
        };
    }

    public int getMaxYears() {
        return switch (this) {
            case LICENCE -> 3;
            case MASTER -> 2;
            case PREPA_INGENIEUR -> 2;
            case CYCLE_INGENIEUR -> 3;
            case CPGE -> 2;
            case PREPA_VOGT -> 2;
        };
    }

    public String getDisplayLabel(int yearIndex) {
        return getDisplayPrefix() + yearIndex;
    }
}
