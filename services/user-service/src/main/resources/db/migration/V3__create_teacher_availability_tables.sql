-- V3: Create teacher availability tables

-- Main teacher availability table
CREATE TABLE teacher_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL UNIQUE,
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    CONSTRAINT fk_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Individual time slots for each teacher's availability
CREATE TABLE availability_time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    availability_id UUID NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    hour_start INTEGER NOT NULL,
    hour_end INTEGER NOT NULL,
    CONSTRAINT fk_availability FOREIGN KEY (availability_id) REFERENCES teacher_availability(id) ON DELETE CASCADE,
    CONSTRAINT chk_day CHECK (day_of_week IN ('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi')),
    CONSTRAINT chk_hour CHECK (hour_start >= 8 AND hour_start < 17 AND hour_end = hour_start + 1),
    CONSTRAINT unique_slot UNIQUE (availability_id, day_of_week, hour_start)
);

-- Create indexes for better query performance
CREATE INDEX idx_teacher_availability_teacher_id ON teacher_availability(teacher_id);
CREATE INDEX idx_availability_time_slots_availability_id ON availability_time_slots(availability_id);
CREATE INDEX idx_availability_time_slots_day_hour ON availability_time_slots(day_of_week, hour_start);
