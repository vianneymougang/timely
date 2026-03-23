package com.timely.bookingservice.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.timely.bookingservice.dto.request.EcoleRequest;
import com.timely.bookingservice.dto.response.EcoleResponse;
import com.timely.bookingservice.entity.Ecole;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EcoleMapper {

    EcoleResponse toResponse(Ecole ecole);

    Ecole toEntity(EcoleRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(EcoleRequest request, @MappingTarget Ecole ecole);
}
