package com.timely.bookingservice.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.bookingservice.dto.request.ReservationRequest;
import com.timely.bookingservice.dto.response.ReservationResponse;
import com.timely.bookingservice.entity.Cours;
import com.timely.bookingservice.entity.GroupeEtudiant;
import com.timely.bookingservice.entity.Reservation;
import com.timely.bookingservice.entity.Salle;
import com.timely.bookingservice.entity.enums.TypeCours;
import com.timely.bookingservice.entity.enums.TypeSalle;
import com.timely.bookingservice.exception.ConflictException;
import com.timely.bookingservice.exception.ResourceNotFoundException;
import com.timely.bookingservice.mapper.ReservationMapper;
import com.timely.bookingservice.repository.CoursRepository;
import com.timely.bookingservice.repository.GroupeEtudiantRepository;
import com.timely.bookingservice.repository.ReservationRepository;
import com.timely.bookingservice.repository.SalleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final CoursRepository coursRepository;
    private final SalleRepository salleRepository;
    private final GroupeEtudiantRepository groupeEtudiantRepository;
    private final ReservationMapper reservationMapper;

    @Transactional
    public ReservationResponse create(ReservationRequest request) {
        Cours cours = coursRepository.findById(request.getCoursId())
                .orElseThrow(() -> new ResourceNotFoundException("Cours non trouvé avec l'id: " + request.getCoursId()));
        Salle salle = salleRepository.findById(request.getSalleId())
                .orElseThrow(() -> new ResourceNotFoundException("Salle non trouvée avec l'id: " + request.getSalleId()));

        validateCapacite(cours, salle);
        validateTypeSalle(cours.getTypeCours(), salle.getTypeSalle());
        validateChevauchement(request, null);

        Reservation reservation = reservationMapper.toEntity(request);
        reservation.setCours(cours);
        reservation.setSalle(salle);

        if (request.getGroupeEtudiantId() != null) {
            GroupeEtudiant groupe = groupeEtudiantRepository.findById(request.getGroupeEtudiantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Groupe non trouvé avec l'id: " + request.getGroupeEtudiantId()));
            reservation.setGroupeEtudiant(groupe);
        }

        return reservationMapper.toResponse(reservationRepository.save(reservation));
    }

    @Transactional(readOnly = true)
    public ReservationResponse getById(UUID id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réservation non trouvée avec l'id: " + id));
        return reservationMapper.toResponse(reservation);
    }

    @Transactional(readOnly = true)
    public Page<ReservationResponse> getAll(Pageable pageable) {
        return reservationRepository.findAll(pageable)
                .map(reservationMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ReservationResponse> getBySalleId(UUID salleId, Pageable pageable) {
        return reservationRepository.findBySalleId(salleId, pageable)
                .map(reservationMapper::toResponse);
    }

    @Transactional
    public ReservationResponse update(UUID id, ReservationRequest request) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réservation non trouvée avec l'id: " + id));

        if (request.getCoursId() != null && !request.getCoursId().equals(reservation.getCours().getId())) {
            Cours cours = coursRepository.findById(request.getCoursId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cours non trouvé avec l'id: " + request.getCoursId()));
            reservation.setCours(cours);
        }

        if (request.getSalleId() != null && !request.getSalleId().equals(reservation.getSalle().getId())) {
            Salle salle = salleRepository.findById(request.getSalleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Salle non trouvée avec l'id: " + request.getSalleId()));
            validateCapacite(reservation.getCours(), salle);
            validateTypeSalle(reservation.getCours().getTypeCours(), salle.getTypeSalle());
            reservation.setSalle(salle);
        }

        validateChevauchement(request, id);

        if (request.getGroupeEtudiantId() != null) {
            GroupeEtudiant groupe = groupeEtudiantRepository.findById(request.getGroupeEtudiantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Groupe non trouvé avec l'id: " + request.getGroupeEtudiantId()));
            reservation.setGroupeEtudiant(groupe);
        }

        reservationMapper.updateEntity(request, reservation);
        return reservationMapper.toResponse(reservationRepository.save(reservation));
    }

    @Transactional
    public void delete(UUID id) {
        if (!reservationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Réservation non trouvée avec l'id: " + id);
        }
        reservationRepository.deleteById(id);
    }

    private void validateCapacite(Cours cours, Salle salle) {
        if (cours.getEffectifGroupe() != null && cours.getEffectifGroupe() > salle.getCapacite()) {
            throw new ConflictException(
                    "La capacité de la salle (" + salle.getCapacite() +
                    ") est insuffisante pour l'effectif du cours (" + cours.getEffectifGroupe() + ")");
        }
    }

    private void validateTypeSalle(TypeCours typeCours, TypeSalle typeSalle) {
        boolean compatible = switch (typeCours) {
            case CM -> typeSalle == TypeSalle.AMPHITHEATRE || typeSalle == TypeSalle.SALLE_COURS;
            case TD -> typeSalle == TypeSalle.SALLE_COURS;
            case TP -> typeSalle == TypeSalle.LABORATOIRE;
        };

        if (!compatible) {
            throw new ConflictException(
                    "Le type de salle '" + typeSalle + "' n'est pas compatible avec le type de cours '" + typeCours + "'");
        }
    }

    private void validateChevauchement(ReservationRequest request, UUID excludeId) {
        List<Reservation> chevauchements = reservationRepository.findChevauchements(
                request.getSalleId(),
                request.getDateReservation(),
                request.getHeureDebut(),
                request.getHeureFin());

        if (excludeId != null) {
            chevauchements = chevauchements.stream()
                    .filter(r -> !r.getId().equals(excludeId))
                    .collect(Collectors.toList());
        }

        if (!chevauchements.isEmpty()) {
            throw new ConflictException("La salle est déjà réservée sur ce créneau horaire");
        }
    }
}
