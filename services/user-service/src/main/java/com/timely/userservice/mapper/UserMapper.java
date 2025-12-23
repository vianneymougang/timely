package com.timely.userservice.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.timely.userservice.dto.AdminDto;
import com.timely.userservice.dto.CreateAdminRequest;
import com.timely.userservice.dto.CreateTeacherRequest;
import com.timely.userservice.dto.InternalUserDto;
import com.timely.userservice.dto.TeacherDto;
import com.timely.userservice.dto.UpdateUserRequest;
import com.timely.userservice.dto.UserDto;
import com.timely.userservice.model.Admin;
import com.timely.userservice.model.Teacher;
import com.timely.userservice.model.User;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    
    UserDto toDto(User user);
    
    TeacherDto toTeacherDto(Teacher teacher);
    
    AdminDto toAdminDto(Admin admin);
    
    InternalUserDto toInternalDto(User user);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "status", ignore = true)
    Teacher toTeacherEntity(CreateTeacherRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "status", ignore = true)
    Admin toAdminEntity(CreateAdminRequest request);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "role", ignore = true)
    void updateUserFromDto(UpdateUserRequest request, @MappingTarget User user);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "role", ignore = true)
    void updateTeacherFromDto(UpdateUserRequest request, @MappingTarget Teacher teacher);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "role", ignore = true)
    void updateAdminFromDto(UpdateUserRequest request, @MappingTarget Admin admin);
}
