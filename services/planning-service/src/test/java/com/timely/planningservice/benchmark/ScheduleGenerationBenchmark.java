package com.timely.planningservice.benchmark;

import org.openjdk.jmh.annotations.*;
import org.openjdk.jmh.infra.Blackhole;
import org.openjdk.jmh.runner.Runner;
import org.openjdk.jmh.runner.RunnerException;
import org.openjdk.jmh.runner.options.Options;
import org.openjdk.jmh.runner.options.OptionsBuilder;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;

/**
 * JMH Benchmark for Schedule Generation Performance
 *
 * CRITICAL REQUIREMENT: Schedule generation must be < 10 seconds for 200 courses
 *
 * To run this benchmark:
 * 1. Build the project: mvn clean package
 * 2. Run the benchmark: java -jar target/benchmarks.jar
 *
 * Or run directly in IDE by executing the main() method.
 */
@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.MILLISECONDS)
@State(Scope.Benchmark)
@Fork(value = 2, jvmArgs = {"-Xms2G", "-Xmx4G"})
@Warmup(iterations = 3, time = 2, timeUnit = TimeUnit.SECONDS)
@Measurement(iterations = 5, time = 5, timeUnit = TimeUnit.SECONDS)
public class ScheduleGenerationBenchmark {

    @State(Scope.Benchmark)
    public static class BenchmarkState {
        @Param({"10", "50", "100", "200"})
        public int numberOfCourses;

        public List<CourseData> courses;
        public List<RoomData> rooms;
        public List<ProfessorData> professors;

        @Setup(Level.Trial)
        public void setup() {
            Random random = new Random(42); // Fixed seed for reproducibility

            // Generate test data
            rooms = generateRooms(20);
            professors = generateProfessors(30);
            courses = generateCourses(numberOfCourses, random);

            System.out.println("Benchmark setup complete: " + numberOfCourses + " courses, " +
                             rooms.size() + " rooms, " + professors.size() + " professors");
        }

        private List<CourseData> generateCourses(int count, Random random) {
            List<CourseData> result = new ArrayList<>(count);
            String[] courseNames = {
                "Introduction to Programming", "Data Structures", "Algorithms",
                "Database Systems", "Operating Systems", "Computer Networks",
                "Software Engineering", "Web Development", "Mobile Development",
                "Machine Learning", "Artificial Intelligence", "Computer Graphics"
            };

            for (int i = 0; i < count; i++) {
                CourseData course = new CourseData();
                course.id = (long) i;
                course.name = courseNames[random.nextInt(courseNames.length)] + " " + i;
                course.code = "CS" + (1000 + i);
                course.credits = 3;
                course.studentsEnrolled = 20 + random.nextInt(80); // 20-100 students
                course.hoursPerWeek = 3 + random.nextInt(3); // 3-5 hours
                course.preferredRoomCapacity = course.studentsEnrolled + 5;
                course.professorId = (long) random.nextInt(30);
                result.add(course);
            }
            return result;
        }

        private List<RoomData> generateRooms(int count) {
            List<RoomData> result = new ArrayList<>(count);
            String[] buildings = {"A", "B", "C", "D"};

            for (int i = 0; i < count; i++) {
                RoomData room = new RoomData();
                room.id = (long) i;
                room.number = buildings[i % buildings.length] + (100 + i);
                room.capacity = 30 + (i % 5) * 20; // 30, 50, 70, 90, 110
                room.hasProjector = i % 2 == 0;
                room.hasComputers = i % 3 == 0;
                result.add(room);
            }
            return result;
        }

        private List<ProfessorData> generateProfessors(int count) {
            List<ProfessorData> result = new ArrayList<>(count);

            for (int i = 0; i < count; i++) {
                ProfessorData professor = new ProfessorData();
                professor.id = (long) i;
                professor.name = "Professor " + (char)('A' + (i % 26)) + i;
                professor.maxHoursPerWeek = 20 + (i % 5) * 2; // 20-28 hours
                result.add(professor);
            }
            return result;
        }
    }

    /**
     * Benchmark: Schedule Generation - Greedy Algorithm
     * This simulates the core scheduling algorithm
     */
    @Benchmark
    public void scheduleGeneration_GreedyAlgorithm(BenchmarkState state, Blackhole blackhole) {
        List<TimeSlot> schedule = generateScheduleGreedy(
            state.courses,
            state.rooms,
            state.professors
        );
        blackhole.consume(schedule);
    }

    /**
     * Benchmark: Conflict Detection
     * This tests the performance of conflict detection algorithm
     */
    @Benchmark
    public void conflictDetection(BenchmarkState state, Blackhole blackhole) {
        List<TimeSlot> schedule = generateScheduleGreedy(
            state.courses,
            state.rooms,
            state.professors
        );

        List<Conflict> conflicts = detectConflicts(schedule);
        blackhole.consume(conflicts);
    }

    /**
     * Benchmark: Complete Schedule Generation with Validation
     * This tests the full pipeline including validation and optimization
     */
    @Benchmark
    public void completeScheduleGeneration(BenchmarkState state, Blackhole blackhole) {
        // Phase 1: Initial generation
        List<TimeSlot> schedule = generateScheduleGreedy(
            state.courses,
            state.rooms,
            state.professors
        );

        // Phase 2: Conflict detection
        List<Conflict> conflicts = detectConflicts(schedule);

        // Phase 3: Conflict resolution (if any)
        if (!conflicts.isEmpty()) {
            resolveConflicts(schedule, conflicts, state.rooms);
        }

        // Phase 4: Validation
        boolean isValid = validateSchedule(schedule, state.courses);

        ScheduleResult result = new ScheduleResult(schedule, conflicts, isValid);
        blackhole.consume(result);
    }

    // ==================== Scheduling Algorithms ====================

    /**
     * Greedy algorithm for schedule generation
     * Tries to place each course in the first available slot
     */
    private List<TimeSlot> generateScheduleGreedy(
            List<CourseData> courses,
            List<RoomData> rooms,
            List<ProfessorData> professors) {

        List<TimeSlot> schedule = new ArrayList<>();
        LocalDate startDate = LocalDate.now();

        // Time slots: Monday-Friday, 8:00-18:00
        List<DayTimeSlot> availableSlots = generateAvailableSlots();

        for (CourseData course : courses) {
            boolean placed = false;

            for (DayTimeSlot daySlot : availableSlots) {
                for (RoomData room : rooms) {
                    if (room.capacity >= course.preferredRoomCapacity) {
                        // Check if slot is available
                        if (isSlotAvailable(schedule, room, daySlot, course.professorId)) {
                            TimeSlot slot = new TimeSlot();
                            slot.courseId = course.id;
                            slot.courseName = course.name;
                            slot.roomId = room.id;
                            slot.roomNumber = room.number;
                            slot.professorId = course.professorId;
                            slot.dayOfWeek = daySlot.day;
                            slot.startTime = daySlot.startTime;
                            slot.endTime = daySlot.endTime;
                            slot.date = startDate.plusDays(daySlot.day - 1);

                            schedule.add(slot);
                            placed = true;
                            break;
                        }
                    }
                }
                if (placed) break;
            }
        }

        return schedule;
    }

    private List<DayTimeSlot> generateAvailableSlots() {
        List<DayTimeSlot> slots = new ArrayList<>();

        // Monday to Friday (1-5)
        for (int day = 1; day <= 5; day++) {
            // 8:00-10:00, 10:00-12:00, 13:00-15:00, 15:00-17:00
            slots.add(new DayTimeSlot(day, LocalTime.of(8, 0), LocalTime.of(10, 0)));
            slots.add(new DayTimeSlot(day, LocalTime.of(10, 0), LocalTime.of(12, 0)));
            slots.add(new DayTimeSlot(day, LocalTime.of(13, 0), LocalTime.of(15, 0)));
            slots.add(new DayTimeSlot(day, LocalTime.of(15, 0), LocalTime.of(17, 0)));
        }

        return slots;
    }

    private boolean isSlotAvailable(List<TimeSlot> schedule, RoomData room,
                                   DayTimeSlot daySlot, Long professorId) {
        for (TimeSlot slot : schedule) {
            // Room conflict
            if (slot.roomId.equals(room.id) &&
                slot.dayOfWeek == daySlot.day &&
                timesOverlap(slot.startTime, slot.endTime, daySlot.startTime, daySlot.endTime)) {
                return false;
            }

            // Professor conflict
            if (slot.professorId.equals(professorId) &&
                slot.dayOfWeek == daySlot.day &&
                timesOverlap(slot.startTime, slot.endTime, daySlot.startTime, daySlot.endTime)) {
                return false;
            }
        }
        return true;
    }

    private boolean timesOverlap(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
        return !start1.isAfter(end2) && !end1.isBefore(start2);
    }

    // ==================== Conflict Detection ====================

    private List<Conflict> detectConflicts(List<TimeSlot> schedule) {
        List<Conflict> conflicts = new ArrayList<>();

        for (int i = 0; i < schedule.size(); i++) {
            for (int j = i + 1; j < schedule.size(); j++) {
                TimeSlot slot1 = schedule.get(i);
                TimeSlot slot2 = schedule.get(j);

                if (slot1.dayOfWeek == slot2.dayOfWeek) {
                    // Room conflict
                    if (slot1.roomId.equals(slot2.roomId) &&
                        timesOverlap(slot1.startTime, slot1.endTime, slot2.startTime, slot2.endTime)) {
                        conflicts.add(new Conflict("ROOM_CONFLICT", slot1, slot2));
                    }

                    // Professor conflict
                    if (slot1.professorId.equals(slot2.professorId) &&
                        timesOverlap(slot1.startTime, slot1.endTime, slot2.startTime, slot2.endTime)) {
                        conflicts.add(new Conflict("PROFESSOR_CONFLICT", slot1, slot2));
                    }
                }
            }
        }

        return conflicts;
    }

    // ==================== Conflict Resolution ====================

    private void resolveConflicts(List<TimeSlot> schedule, List<Conflict> conflicts, List<RoomData> rooms) {
        // Simple resolution: try to move conflicting courses to different slots
        for (Conflict conflict : conflicts) {
            TimeSlot slot = conflict.slot2; // Move the second conflicting slot

            // Try to find alternative slot
            List<DayTimeSlot> availableSlots = generateAvailableSlots();
            for (DayTimeSlot daySlot : availableSlots) {
                for (RoomData room : rooms) {
                    if (isSlotAvailable(schedule, room, daySlot, slot.professorId)) {
                        slot.roomId = room.id;
                        slot.roomNumber = room.number;
                        slot.dayOfWeek = daySlot.day;
                        slot.startTime = daySlot.startTime;
                        slot.endTime = daySlot.endTime;
                        break;
                    }
                }
            }
        }
    }

    // ==================== Validation ====================

    private boolean validateSchedule(List<TimeSlot> schedule, List<CourseData> courses) {
        // Check if all courses are scheduled
        return schedule.size() >= courses.size() * 0.95; // At least 95% of courses scheduled
    }

    // ==================== Data Classes ====================

    static class CourseData {
        Long id;
        String name;
        String code;
        int credits;
        int studentsEnrolled;
        int hoursPerWeek;
        int preferredRoomCapacity;
        Long professorId;
    }

    static class RoomData {
        Long id;
        String number;
        int capacity;
        boolean hasProjector;
        boolean hasComputers;
    }

    static class ProfessorData {
        Long id;
        String name;
        int maxHoursPerWeek;
    }

    static class TimeSlot {
        Long courseId;
        String courseName;
        Long roomId;
        String roomNumber;
        Long professorId;
        int dayOfWeek; // 1=Monday, 5=Friday
        LocalTime startTime;
        LocalTime endTime;
        LocalDate date;
    }

    static class DayTimeSlot {
        int day;
        LocalTime startTime;
        LocalTime endTime;

        DayTimeSlot(int day, LocalTime startTime, LocalTime endTime) {
            this.day = day;
            this.startTime = startTime;
            this.endTime = endTime;
        }
    }

    static class Conflict {
        String type;
        TimeSlot slot1;
        TimeSlot slot2;

        Conflict(String type, TimeSlot slot1, TimeSlot slot2) {
            this.type = type;
            this.slot1 = slot1;
            this.slot2 = slot2;
        }
    }

    static class ScheduleResult {
        List<TimeSlot> schedule;
        List<Conflict> conflicts;
        boolean isValid;

        ScheduleResult(List<TimeSlot> schedule, List<Conflict> conflicts, boolean isValid) {
            this.schedule = schedule;
            this.conflicts = conflicts;
            this.isValid = isValid;
        }
    }

    // ==================== Main Method to Run Benchmark ====================

    public static void main(String[] args) throws RunnerException {
        Options opt = new OptionsBuilder()
                .include(ScheduleGenerationBenchmark.class.getSimpleName())
                .forks(2)
                .warmupIterations(3)
                .warmupTime(org.openjdk.jmh.runner.options.TimeValue.seconds(2))
                .measurementIterations(5)
                .measurementTime(org.openjdk.jmh.runner.options.TimeValue.seconds(5))
                .build();

        new Runner(opt).run();
    }
}
