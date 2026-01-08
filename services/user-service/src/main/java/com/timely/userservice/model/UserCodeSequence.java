package com.timely.userservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_code_sequence")
@Getter
@Setter
@NoArgsConstructor
public class UserCodeSequence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String sequenceType; // "TEACHER", "ADMIN", or "GLOBAL"
    
    @Column(nullable = false)
    private Long currentValue = 0L;
    
    @Version
    private Long version; // Optimistic locking for concurrency control
}
