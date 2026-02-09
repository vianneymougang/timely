package com.timely.agoraservice.entity;

import com.timely.agoraservice.entity.enums.TypeLog;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "logs_integration")
@Getter
@Setter
@NoArgsConstructor
public class LogIntegration {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "export_agora_id", nullable = false)
    private ExportAgora exportAgora;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeLog typeLog;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(columnDefinition = "TEXT")
    private String stackTrace;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
