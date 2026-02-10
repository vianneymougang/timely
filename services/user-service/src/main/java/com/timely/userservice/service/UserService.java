package com.timely.userservice.service;

import java.util.List;
import java.util.UUID;

import com.timely.userservice.dto.AdminDto;
import com.timely.userservice.dto.CreateAdminRequest;
import com.timely.userservice.dto.CreateTeacherRequest;
import com.timely.userservice.dto.InternalUserDto;
import com.timely.userservice.dto.TeacherDto;
import com.timely.userservice.dto.UpdateUserRequest;
import com.timely.userservice.dto.UserDto;

public interface UserService {

    TeacherDto createTeacher(CreateTeacherRequest request);

    AdminDto createAdmin(CreateAdminRequest request);

    UserDto getUserById(UUID id);

    InternalUserDto getInternalUserByEmail(String email);

    InternalUserDto getInternalUserById(UUID id);

    List<UserDto> getAllUsers();

    List<TeacherDto> getAllTeachers();

    UserDto updateUser(UUID id, UpdateUserRequest request);

    void deleteUser(UUID id);

    UserDto blockUser(UUID id);

    UserDto unblockUser(UUID id);

    void updatePassword(UUID id, String currentPassword, String newPassword);

    boolean existsByEmail(String email);

    UserDto getUserByEmail(String email);
}
