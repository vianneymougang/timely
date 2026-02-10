package com.timely.userservice.service;

import com.timely.userservice.model.UserCodeSequence;
import com.timely.userservice.repository.UserCodeSequenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserCodeGeneratorServiceImpl implements UserCodeGeneratorService {

    private final UserCodeSequenceRepository sequenceRepository;

    @Transactional
    public String generateTeacherCode() {
        return generateCode("TEACHER", "T");
    }

    @Transactional
    public String generateAdminCode() {
        return generateCode("ADMIN", "A");
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

        // Format: T000001, A000001, etc.
        return String.format("%s%06d", prefix, sequence.getCurrentValue());
    }
}
