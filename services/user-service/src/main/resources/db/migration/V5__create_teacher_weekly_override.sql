CREATE TABLE teacher_weekly_overrides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL,
    week_start DATE NOT NULL,
    day_of_week VARCHAR(10) NOT NULL,
    hour_start INTEGER NOT NULL,
    hour_end INTEGER NOT NULL,
    override_type VARCHAR(15) NOT NULL,
    CONSTRAINT fk_override_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_override_day CHECK (day_of_week IN ('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY')),
    CONSTRAINT chk_override_hour CHECK (hour_start >= 8 AND hour_start <= 16 AND hour_end = hour_start + 1),
    CONSTRAINT chk_override_type CHECK (override_type IN ('UNAVAILABLE','AVAILABLE')),
    CONSTRAINT unique_override UNIQUE (teacher_id, week_start, day_of_week, hour_start)
);

CREATE INDEX idx_override_teacher_week ON teacher_weekly_overrides(teacher_id, week_start);
