package com.timely.bookingservice.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.timely.bookingservice.dto.request.ReservationRequest;
import com.timely.bookingservice.dto.response.ReservationResponse;
import com.timely.bookingservice.entity.Reservation;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ReservationMapper {

    @Mapping(source = "cours.id", target = "coursId")
    @Mapping(source = "cours.intitule", target = "coursIntitule")
    @Mapping(source = "salle.id", target = "salleId")
    @Mapping(source = "salle.nom", target = "salleNom")
    @Mapping(source = "groupeEtudiant.id", target = "groupeEtudiantId")
    ReservationResponse toResponse(Reservation reservation);

    @Mapping(target = "cours", ignore = true)
    @Mapping(target = "salle", ignore = true)
    @Mapping(target = "groupeEtudiant", ignore = true)
    @Mapping(target = "statut", constant = "TEMPORAIRE")
    Reservation toEntity(ReservationRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "cours", ignore = true)
    @Mapping(target = "salle", ignore = true)
    @Mapping(target = "groupeEtudiant", ignore = true)
    void updateEntity(ReservationRequest request, @MappingTarget Reservation reservation);
}
