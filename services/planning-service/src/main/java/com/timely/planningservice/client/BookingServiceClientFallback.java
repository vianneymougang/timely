package com.timely.planningservice.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * Fallback factory pour BookingServiceClient.
 * Fournit des réponses dégradées en cas d'indisponibilité du booking-service.
 */
@Component
@Slf4j
public class BookingServiceClientFallback implements FallbackFactory<BookingServiceClient> {

    @Override
    public BookingServiceClient create(Throwable cause) {
        return new BookingServiceClient() {

            @Override
            public BookingServiceClient.CoursDTO getCours(UUID id) {
                log.error("Fallback triggered for getCours({}): {}", id, cause.getMessage());
                // Retourner un cours vide avec un indicateur d'erreur
                return new BookingServiceClient.CoursDTO(
                        id,
                        "Service indisponible",
                        "UNKNOWN",
                        0,
                        0,
                        null,
                        null,
                        null
                );
            }

            @Override
            public List<BookingServiceClient.CoursDTO> getCoursByEcole(UUID ecoleId) {
                log.error("Fallback triggered for getCoursByEcole({}): {}", ecoleId, cause.getMessage());
                // Retourner une liste vide plutôt qu'une erreur
                return Collections.emptyList();
            }

            @Override
            public BookingServiceClient.SalleDTO getSalle(UUID id) {
                log.error("Fallback triggered for getSalle({}): {}", id, cause.getMessage());
                return new BookingServiceClient.SalleDTO(
                        id,
                        "N/A",
                        "Service indisponible",
                        "UNKNOWN",
                        0,
                        null
                );
            }

            @Override
            public BookingServiceClient.ReservationDTO getReservation(UUID id) {
                log.error("Fallback triggered for getReservation({}): {}", id, cause.getMessage());
                return new BookingServiceClient.ReservationDTO(
                        id,
                        null,
                        null,
                        null,
                        null,
                        null,
                        "UNAVAILABLE",
                        null,
                        null,
                        null,
                        null
                );
            }

            @Override
            public List<BookingServiceClient.ReservationDTO> getReservationsByFilters(
                    UUID salleId, UUID coursId, String dateDebut, String dateFin) {
                log.error("Fallback triggered for getReservationsByFilters: {}", cause.getMessage());
                return Collections.emptyList();
            }

            @Override
            public List<BookingServiceClient.SalleDTO> getSallesDisponibles(
                    String heureDebut, String heureFin, String jourSemaine) {
                log.error("Fallback triggered for getSallesDisponibles: {}", cause.getMessage());
                return Collections.emptyList();
            }

            @Override
            public BookingServiceClient.ReservationDTO createReservation(
                    BookingServiceClient.CreateReservationRequest request) {
                log.error("Fallback triggered for createReservation: {}", cause.getMessage());
                // Ne pas créer de réservation en mode fallback
                throw new IllegalStateException(
                        "Booking service is unavailable. Cannot create reservation. Please try again later.",
                        cause
                );
            }

            @Override
            public List<BookingServiceClient.GroupeDTO> getGroupesByCours(UUID coursId) {
                log.error("Fallback triggered for getGroupesByCours({}): {}", coursId, cause.getMessage());
                return Collections.emptyList();
            }

            @Override
            public BookingServiceClient.SalleDTO autoAssignSalle(
                    BookingServiceClient.AutoAssignSalleRequest request) {
                log.error("Fallback triggered for autoAssignSalle: {}", cause.getMessage());
                // En cas d'échec, retourner null pour indiquer qu'aucune salle n'est disponible
                return null;
            }
        };
    }
}
