package com.timely.planningservice.repository.specification;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.timely.planningservice.entity.Creneau;
import com.timely.planningservice.entity.EmploiDuTemps;
import com.timely.planningservice.entity.enums.StatutEmploi;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;

/**
 * JPA Specifications for EmploiDuTemps advanced search
 */
public class EmploiDuTempsSpecification {

    /**
     * Filter by école ID
     */
    public static Specification<EmploiDuTemps> withEcoleId(UUID ecoleId) {
        return (root, query, criteriaBuilder) -> {
            if (ecoleId == null) {
                return null;
            }
            return criteriaBuilder.equal(root.get("ecoleId"), ecoleId);
        };
    }

    /**
     * Filter by status
     */
    public static Specification<EmploiDuTemps> withStatut(StatutEmploi statut) {
        return (root, query, criteriaBuilder) -> {
            if (statut == null) {
                return null;
            }
            return criteriaBuilder.equal(root.get("statut"), statut);
        };
    }

    /**
     * Filter by week (emplois that overlap with the week starting on semaine date)
     */
    public static Specification<EmploiDuTemps> withSemaine(LocalDate semaine) {
        return (root, query, criteriaBuilder) -> {
            if (semaine == null) {
                return null;
            }
            LocalDate weekEnd = semaine.plusDays(6);
            return criteriaBuilder.and(
                    criteriaBuilder.lessThanOrEqualTo(root.get("dateDebut"), weekEnd),
                    criteriaBuilder.greaterThanOrEqualTo(root.get("dateFin"), semaine)
            );
        };
    }

    /**
     * Filter by enseignant ID (searches in creneaux)
     */
    public static Specification<EmploiDuTemps> withEnseignantId(UUID enseignantId) {
        return (root, query, criteriaBuilder) -> {
            if (enseignantId == null) {
                return null;
            }

            // Avoid duplicate results in count queries
            if (query.getResultType() == Long.class || query.getResultType() == long.class) {
                query.distinct(true);
            }

            Join<EmploiDuTemps, Creneau> creneauJoin = root.join("creneaux", JoinType.INNER);
            return criteriaBuilder.equal(creneauJoin.get("enseignantId"), enseignantId);
        };
    }

    /**
     * Filter by salle ID (searches in creneaux)
     */
    public static Specification<EmploiDuTemps> withSalleId(UUID salleId) {
        return (root, query, criteriaBuilder) -> {
            if (salleId == null) {
                return null;
            }

            // Avoid duplicate results in count queries
            if (query.getResultType() == Long.class || query.getResultType() == long.class) {
                query.distinct(true);
            }

            Join<EmploiDuTemps, Creneau> creneauJoin = root.join("creneaux", JoinType.INNER);
            return criteriaBuilder.equal(creneauJoin.get("salleId"), salleId);
        };
    }

    /**
     * Filter by groupe étudiant ID (searches in creneaux)
     */
    public static Specification<EmploiDuTemps> withGroupeId(UUID groupeId) {
        return (root, query, criteriaBuilder) -> {
            if (groupeId == null) {
                return null;
            }

            // Avoid duplicate results in count queries
            if (query.getResultType() == Long.class || query.getResultType() == long.class) {
                query.distinct(true);
            }

            Join<EmploiDuTemps, Creneau> creneauJoin = root.join("creneaux", JoinType.INNER);
            return criteriaBuilder.equal(creneauJoin.get("groupeId"), groupeId);
        };
    }

    /**
     * Combine all specifications with AND logic
     */
    public static Specification<EmploiDuTemps> buildSearchSpecification(
            UUID ecoleId,
            UUID enseignantId,
            UUID salleId,
            UUID groupeId,
            LocalDate semaine,
            StatutEmploi statut) {

        return Specification
                .where(withEcoleId(ecoleId))
                .and(withEnseignantId(enseignantId))
                .and(withSalleId(salleId))
                .and(withGroupeId(groupeId))
                .and(withSemaine(semaine))
                .and(withStatut(statut));
    }
}
