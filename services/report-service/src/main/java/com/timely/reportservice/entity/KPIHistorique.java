package com.timely.reportservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "kpi_historique")
@Getter
@Setter
@NoArgsConstructor
public class KPIHistorique {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "nom_kpi", nullable = false, length = 100)
    private String nomKpi;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal valeur;

    @Column(length = 50)
    private String unite;

    @Column(length = 50)
    private String periode;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "detail_json", columnDefinition = "jsonb")
    private Map<String, Object> detailJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (date == null) {
            date = LocalDate.now();
        }
    }
}
