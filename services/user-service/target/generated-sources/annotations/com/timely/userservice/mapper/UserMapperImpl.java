package com.timely.userservice.mapper;

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
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-08T00:32:14+0100",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto toDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDto userDto = new UserDto();

        userDto.setId( user.getId() );
        userDto.setName( user.getName() );
        userDto.setSurname( user.getSurname() );
        userDto.setEmail( user.getEmail() );
        userDto.setTelephoneNumber( user.getTelephoneNumber() );
        userDto.setRole( user.getRole() );
        userDto.setStatus( user.getStatus() );
        userDto.setCreationDate( user.getCreationDate() );

        return userDto;
    }

    @Override
    public TeacherDto toTeacherDto(Teacher teacher) {
        if ( teacher == null ) {
            return null;
        }

        TeacherDto teacherDto = new TeacherDto();

        teacherDto.setId( teacher.getId() );
        teacherDto.setName( teacher.getName() );
        teacherDto.setSurname( teacher.getSurname() );
        teacherDto.setEmail( teacher.getEmail() );
        teacherDto.setTelephoneNumber( teacher.getTelephoneNumber() );
        teacherDto.setRole( teacher.getRole() );
        teacherDto.setStatus( teacher.getStatus() );
        teacherDto.setCreationDate( teacher.getCreationDate() );
        teacherDto.setMatricule( teacher.getMatricule() );
        teacherDto.setGrade( teacher.getGrade() );
        teacherDto.setRank( teacher.getRank() );
        teacherDto.setHourlyRate( teacher.getHourlyRate() );

        return teacherDto;
    }

    @Override
    public AdminDto toAdminDto(Admin admin) {
        if ( admin == null ) {
            return null;
        }

        AdminDto adminDto = new AdminDto();

        adminDto.setId( admin.getId() );
        adminDto.setName( admin.getName() );
        adminDto.setSurname( admin.getSurname() );
        adminDto.setEmail( admin.getEmail() );
        adminDto.setTelephoneNumber( admin.getTelephoneNumber() );
        adminDto.setRole( admin.getRole() );
        adminDto.setStatus( admin.getStatus() );
        adminDto.setCreationDate( admin.getCreationDate() );
        adminDto.setAccessLevel( admin.getAccessLevel() );
        adminDto.setDepartment( admin.getDepartment() );

        return adminDto;
    }

    @Override
    public InternalUserDto toInternalDto(User user) {
        if ( user == null ) {
            return null;
        }

        InternalUserDto internalUserDto = new InternalUserDto();

        internalUserDto.setId( user.getId() );
        internalUserDto.setName( user.getName() );
        internalUserDto.setSurname( user.getSurname() );
        internalUserDto.setEmail( user.getEmail() );
        internalUserDto.setTelephoneNumber( user.getTelephoneNumber() );
        internalUserDto.setPassword( user.getPassword() );
        internalUserDto.setRole( user.getRole() );
        internalUserDto.setStatus( user.getStatus() );
        internalUserDto.setCreationDate( user.getCreationDate() );

        return internalUserDto;
    }

    @Override
    public Teacher toTeacherEntity(CreateTeacherRequest request) {
        if ( request == null ) {
            return null;
        }

        Teacher teacher = new Teacher();

        teacher.setName( request.getName() );
        teacher.setSurname( request.getSurname() );
        teacher.setEmail( request.getEmail() );
        teacher.setTelephoneNumber( request.getTelephoneNumber() );
        teacher.setGrade( request.getGrade() );
        teacher.setRank( request.getRank() );
        teacher.setHourlyRate( request.getHourlyRate() );

        return teacher;
    }

    @Override
    public Admin toAdminEntity(CreateAdminRequest request) {
        if ( request == null ) {
            return null;
        }

        Admin admin = new Admin();

        admin.setName( request.getName() );
        admin.setSurname( request.getSurname() );
        admin.setEmail( request.getEmail() );
        admin.setTelephoneNumber( request.getTelephoneNumber() );
        admin.setAccessLevel( request.getAccessLevel() );
        admin.setDepartment( request.getDepartment() );

        return admin;
    }

    @Override
    public void updateUserFromDto(UpdateUserRequest request, User user) {
        if ( request == null ) {
            return;
        }

        if ( request.getName() != null ) {
            user.setName( request.getName() );
        }
        if ( request.getSurname() != null ) {
            user.setSurname( request.getSurname() );
        }
        if ( request.getEmail() != null ) {
            user.setEmail( request.getEmail() );
        }
        if ( request.getTelephoneNumber() != null ) {
            user.setTelephoneNumber( request.getTelephoneNumber() );
        }
        if ( request.getStatus() != null ) {
            user.setStatus( request.getStatus() );
        }
    }

    @Override
    public void updateTeacherFromDto(UpdateUserRequest request, Teacher teacher) {
        if ( request == null ) {
            return;
        }

        if ( request.getName() != null ) {
            teacher.setName( request.getName() );
        }
        if ( request.getSurname() != null ) {
            teacher.setSurname( request.getSurname() );
        }
        if ( request.getEmail() != null ) {
            teacher.setEmail( request.getEmail() );
        }
        if ( request.getTelephoneNumber() != null ) {
            teacher.setTelephoneNumber( request.getTelephoneNumber() );
        }
        if ( request.getStatus() != null ) {
            teacher.setStatus( request.getStatus() );
        }
        if ( request.getMatricule() != null ) {
            teacher.setMatricule( request.getMatricule() );
        }
        if ( request.getGrade() != null ) {
            teacher.setGrade( request.getGrade() );
        }
        if ( request.getRank() != null ) {
            teacher.setRank( request.getRank() );
        }
        if ( request.getHourlyRate() != null ) {
            teacher.setHourlyRate( request.getHourlyRate() );
        }
    }

    @Override
    public void updateAdminFromDto(UpdateUserRequest request, Admin admin) {
        if ( request == null ) {
            return;
        }

        if ( request.getName() != null ) {
            admin.setName( request.getName() );
        }
        if ( request.getSurname() != null ) {
            admin.setSurname( request.getSurname() );
        }
        if ( request.getEmail() != null ) {
            admin.setEmail( request.getEmail() );
        }
        if ( request.getTelephoneNumber() != null ) {
            admin.setTelephoneNumber( request.getTelephoneNumber() );
        }
        if ( request.getStatus() != null ) {
            admin.setStatus( request.getStatus() );
        }
        if ( request.getAccessLevel() != null ) {
            admin.setAccessLevel( request.getAccessLevel() );
        }
        if ( request.getDepartment() != null ) {
            admin.setDepartment( request.getDepartment() );
        }
    }
}
