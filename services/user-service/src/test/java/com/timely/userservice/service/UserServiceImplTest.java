package com.timely.userservice.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.timely.userservice.dto.AdminDto;
import com.timely.userservice.dto.CreateAdminRequest;
import com.timely.userservice.dto.CreateTeacherRequest;
import com.timely.userservice.dto.InternalUserDto;
import com.timely.userservice.dto.TeacherDto;
import com.timely.userservice.dto.UserDto;
import com.timely.userservice.exception.EmailAlreadyExistsException;
import com.timely.userservice.exception.MatriculeAlreadyExistsException;
import com.timely.userservice.exception.UserNotFoundException;
import com.timely.userservice.mapper.UserMapper;
import com.timely.userservice.model.Admin;
import com.timely.userservice.model.Role;
import com.timely.userservice.model.Teacher;
import com.timely.userservice.repository.TeacherRepository;
import com.timely.userservice.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TeacherRepository teacherRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void createTeacher_ShouldCreateTeacherSuccessfully() {
        // Given
        CreateTeacherRequest request = new CreateTeacherRequest(
                "John", "Doe", "john.doe@timely.com", "password123",
                123456L, "MAT001", "Professor", "Senior", "50"
        );
        
        Teacher teacher = new Teacher();
        teacher.setId(UUID.randomUUID());
        teacher.setEmail(request.getEmail());
        teacher.setRole(Role.ROLE_TEACHER);
        
        TeacherDto expectedDto = new TeacherDto();
        expectedDto.setId(teacher.getId());
        expectedDto.setEmail(request.getEmail());

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(teacherRepository.existsByMatricule(request.getMatricule())).thenReturn(false);
        when(userMapper.toTeacherEntity(request)).thenReturn(teacher);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(teacherRepository.save(any(Teacher.class))).thenReturn(teacher);
        when(userMapper.toTeacherDto(teacher)).thenReturn(expectedDto);

        // When
        TeacherDto result = userService.createTeacher(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(request.getEmail());
        verify(userRepository).existsByEmail(request.getEmail());
        verify(teacherRepository).existsByMatricule(request.getMatricule());
        verify(teacherRepository).save(teacher);
    }

    @Test
    void createTeacher_WhenEmailExists_ShouldThrowException() {
        // Given
        CreateTeacherRequest request = new CreateTeacherRequest(
                "John", "Doe", "existing@timely.com", "password123",
                123456L, "MAT001", "Professor", "Senior", "50"
        );

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        // When/Then
        assertThatThrownBy(() -> userService.createTeacher(request))
                .isInstanceOf(EmailAlreadyExistsException.class)
                .hasMessage("Email already exists: existing@timely.com");
        
        verify(userRepository).existsByEmail(request.getEmail());
        verify(teacherRepository, never()).save(any());
    }

    @Test
    void createTeacher_WhenMatriculeExists_ShouldThrowException() {
        // Given
        CreateTeacherRequest request = new CreateTeacherRequest(
                "John", "Doe", "john.doe@timely.com", "password123",
                123456L, "MAT001", "Professor", "Senior", "50"
        );

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(teacherRepository.existsByMatricule(request.getMatricule())).thenReturn(true);

        // When/Then
        assertThatThrownBy(() -> userService.createTeacher(request))
                .isInstanceOf(MatriculeAlreadyExistsException.class)
                .hasMessage("Matricule already exists: MAT001");
        
        verify(teacherRepository, never()).save(any());
    }

    @Test
    void createAdmin_ShouldCreateAdminSuccessfully() {
        // Given
        CreateAdminRequest request = new CreateAdminRequest(
                "Jane", "Admin", "jane.admin@timely.com", "password123",
                987654L, 3, 1
        );
        
        Admin admin = new Admin();
        admin.setId(UUID.randomUUID());
        admin.setEmail(request.getEmail());
        admin.setRole(Role.ROLE_ADMIN);
        
        AdminDto expectedDto = new AdminDto();
        expectedDto.setId(admin.getId());
        expectedDto.setEmail(request.getEmail());

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(userMapper.toAdminEntity(request)).thenReturn(admin);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(Admin.class))).thenReturn(admin);
        when(userMapper.toAdminDto(admin)).thenReturn(expectedDto);

        // When
        AdminDto result = userService.createAdmin(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(request.getEmail());
        verify(userRepository).existsByEmail(request.getEmail());
        verify(userRepository).save(admin);
    }

    @Test
    void getUserById_WhenTeacherExists_ShouldReturnTeacherDto() {
        // Given
        UUID teacherId = UUID.randomUUID();
        Teacher teacher = new Teacher();
        teacher.setId(teacherId);
        teacher.setEmail("teacher@timely.com");
        
        TeacherDto expectedDto = new TeacherDto();
        expectedDto.setId(teacherId);

        when(userRepository.findById(teacherId)).thenReturn(Optional.of(teacher));
        when(userMapper.toTeacherDto(teacher)).thenReturn(expectedDto);

        // When
        UserDto result = userService.getUserById(teacherId);

        // Then
        assertThat(result).isInstanceOf(TeacherDto.class);
        assertThat(result.getId()).isEqualTo(teacherId);
        verify(userRepository).findById(teacherId);
    }

    @Test
    void getUserById_WhenUserDoesNotExist_ShouldThrowException() {
        // Given
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> userService.getUserById(userId))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("User not found with id");
        
        verify(userRepository).findById(userId);
    }

    @Test
    void getInternalUserByEmail_ShouldReturnInternalDto() {
        // Given
        String email = "user@timely.com";
        Teacher teacher = new Teacher();
        teacher.setEmail(email);
        teacher.setPassword("hashedPassword");
        
        InternalUserDto expectedDto = new InternalUserDto();
        expectedDto.setEmail(email);
        expectedDto.setPassword("hashedPassword");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(teacher));
        when(userMapper.toInternalDto(teacher)).thenReturn(expectedDto);

        // When
        InternalUserDto result = userService.getInternalUserByEmail(email);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(email);
        assertThat(result.getPassword()).isNotNull();
        verify(userRepository).findByEmail(email);
    }

    @Test
    void deleteUser_WhenUserExists_ShouldDeleteSuccessfully() {
        // Given
        UUID userId = UUID.randomUUID();
        when(userRepository.existsById(userId)).thenReturn(true);

        // When
        userService.deleteUser(userId);

        // Then
        verify(userRepository).existsById(userId);
        verify(userRepository).deleteById(userId);
    }

    @Test
    void deleteUser_WhenUserDoesNotExist_ShouldThrowException() {
        // Given
        UUID userId = UUID.randomUUID();
        when(userRepository.existsById(userId)).thenReturn(false);

        // When/Then
        assertThatThrownBy(() -> userService.deleteUser(userId))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("User not found with id");
        
        verify(userRepository, never()).deleteById(any());
    }

    @Test
    void existsByEmail_ShouldReturnCorrectResult() {
        // Given
        String email = "test@timely.com";
        when(userRepository.existsByEmail(email)).thenReturn(true);

        // When
        boolean result = userService.existsByEmail(email);

        // Then
        assertThat(result).isTrue();
        verify(userRepository).existsByEmail(email);
    }
}
