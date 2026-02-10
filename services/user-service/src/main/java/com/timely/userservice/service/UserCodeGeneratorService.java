package com.timely.userservice.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.userservice.model.UserCodeSequence;
import com.timely.userservice.repository.UserCodeSequenceRepository;

@Service
public class UserCodeGeneratorService {

    private final UserCodeSequenceRepository sequenceRepository;

    // ✅ Constructeur manuel (remplace @RequiredArgsConstructor)
    public UserCodeGeneratorService(UserCodeSequenceRepository sequenceRepository) {
        this.sequenceRepository = sequenceRepository;
    }

    /**
     * Generate a unique teacher code (format: T000001, T000002, etc.)
     */
    @Transactional
    public String generateTeacherCode() {
        return generateCode("TEACHER", "T");
    }

    /**
     * Generate a unique admin code (format: A000001, A000002, etc.)
     */
    @Transactional
    public String generateAdminCode() {
        return generateCode("ADMIN", "A");
    }

    /**
     * Generate a unique student code (format: S000001, S000002, etc.)
     */
    @Transactional
    public String generateStudentCode() {
        return generateCode("STUDENT", "S");
    }

    /**
     * Generate a unique code for the given sequence type
     * Thread-safe with pessimistic locking
     */
    private String generateCode(String sequenceType, String prefix) {
        UserCodeSequence sequence = sequenceRepository
                .findBySequenceType(sequenceType)
                .orElseGet(() -> {
                    UserCodeSequence newSeq = new UserCodeSequence();
                    newSeq.setSequenceType(sequenceType);
                    newSeq.setCurrentValue(0L);
                    return sequenceRepository.save(newSeq);
                });

        sequence.setCurrentValue(sequence.getCurrentValue() + 1L);
        sequenceRepository.save(sequence);

        // Format: T000001, A000001, S000001, etc.
        return String.format("%s%06d", prefix, sequence.getCurrentValue());
    }
}