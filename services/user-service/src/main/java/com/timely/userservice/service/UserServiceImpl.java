package com.timely.userservice.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.userservice.config.RabbitMQConfig;
import com.timely.userservice.dto.AdminDto;
import com.timely.userservice.dto.BulkUserActionResponse;
import com.timely.userservice.dto.CreateAdminRequest;
import com.timely.userservice.dto.CreateTeacherRequest;
import com.timely.userservice.dto.InternalUserDto;
import com.timely.userservice.dto.TeacherDto;
import com.timely.userservice.dto.UpdateUserRequest;
import com.timely.userservice.dto.UserDto;
import com.timely.userservice.event.UserCreatedEvent;
import com.timely.userservice.exception.EmailAlreadyExistsException;
import com.timely.userservice.exception.MatriculeAlreadyExistsException;
import com.timely.userservice.exception.UserNotFoundException;
import com.timely.userservice.mapper.UserMapper;
import com.timely.userservice.model.Admin;
import com.timely.userservice.model.Role;
import com.timely.userservice.model.Teacher;
import com.timely.userservice.model.User;
import com.timely.userservice.model.UserStatus;
import com.timely.userservice.repository.TeacherRepository;
import com.timely.userservice.repository.UserRepository;
import com.timely.userservice.util.PasswordGenerator;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserCodeGeneratorService userCodeGeneratorService;
    private final RabbitTemplate rabbitTemplate;

    @Override
    @Transactional
    public TeacherDto createTeacher(CreateTeacherRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists: " + request.getEmail());
        }

        // Generate secure random password
        String temporaryPassword = PasswordGenerator.generatePassword(12);

        // Create teacher entity
        Teacher teacher = userMapper.toTeacherEntity(request);
        teacher.setPassword(passwordEncoder.encode(temporaryPassword));
        teacher.setRole(Role.ROLE_TEACHER);
        
        // Auto-generate matricule
        teacher.setMatricule(userCodeGeneratorService.generateTeacherCode());

        // Save teacher
        Teacher savedTeacher = teacherRepository.save(teacher);

        // Publish event to RabbitMQ for email notification
        UserCreatedEvent event = new UserCreatedEvent(
            savedTeacher.getEmail(),
            temporaryPassword,
            savedTeacher.getName(),
            savedTeacher.getSurname(),
            "TEACHER"
        );
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.USER_EXCHANGE,
            RabbitMQConfig.USER_CREATED_ROUTING_KEY,
            event
        );

        return userMapper.toTeacherDto(savedTeacher);
    }

    @Override
    @Transactional
    public AdminDto createAdmin(CreateAdminRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists: " + request.getEmail());
        }

        // Generate secure random password
        String temporaryPassword = PasswordGenerator.generatePassword(12);

        // Create admin entity
        Admin admin = userMapper.toAdminEntity(request);
        admin.setPassword(passwordEncoder.encode(temporaryPassword));
        admin.setRole(Role.ROLE_ADMIN);

        // Save admin
        Admin savedAdmin = (Admin) userRepository.save(admin);

        // Publish event to RabbitMQ for email notification
        UserCreatedEvent event = new UserCreatedEvent(
            savedAdmin.getEmail(),
            temporaryPassword,
            savedAdmin.getName(),
            savedAdmin.getSurname(),
            "ADMIN"
        );
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.USER_EXCHANGE,
            RabbitMQConfig.USER_CREATED_ROUTING_KEY,
            event
        );

        return userMapper.toAdminDto(savedAdmin);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        if (user instanceof Teacher) {
            return userMapper.toTeacherDto((Teacher) user);
        } else if (user instanceof Admin) {
            return userMapper.toAdminDto((Admin) user);
        }
        return userMapper.toDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public InternalUserDto getInternalUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        return userMapper.toInternalDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public InternalUserDto getInternalUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return userMapper.toInternalDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> {
                    if (user instanceof Teacher) {
                        return userMapper.toTeacherDto((Teacher) user);
                    } else if (user instanceof Admin) {
                        return userMapper.toAdminDto((Admin) user);
                    }
                    return userMapper.toDto(user);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDto> getAllTeachers() {
        return userRepository.findAllByRole(Role.ROLE_TEACHER).stream()
                .map(user -> userMapper.toTeacherDto((Teacher) user))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto updateUser(UUID id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        // Check email uniqueness if email is being updated
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new EmailAlreadyExistsException("Email already exists: " + request.getEmail());
            }
        }

        // Update based on user type
        if (user instanceof Teacher teacher) {
            // Check matricule uniqueness if matricule is being updated
            if (request.getMatricule() != null && !request.getMatricule().equals(teacher.getMatricule())) {
                if (teacherRepository.existsByMatricule(request.getMatricule())) {
                    throw new MatriculeAlreadyExistsException("Matricule already exists: " + request.getMatricule());
                }
            }
            userMapper.updateTeacherFromDto(request, teacher);
            Teacher updated = teacherRepository.save(teacher);
            return userMapper.toTeacherDto(updated);
        } else if (user instanceof Admin admin) {
            userMapper.updateAdminFromDto(request, admin);
            Admin updated = (Admin) userRepository.save(admin);
            return userMapper.toAdminDto(updated);
        } else {
            userMapper.updateUserFromDto(request, user);
            User updated = userRepository.save(user);
            return userMapper.toDto(updated);
        }
    }

    @Override
    @Transactional
    public void deleteUser(UUID id) {
        // Soft delete by blocking the user instead of physical deletion
        blockUser(id);
    }
    
    @Override
    @Transactional
    public UserDto blockUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        
        user.setStatus(UserStatus.BLOCKED);
        User blockedUser = userRepository.save(user);
        
        if (blockedUser instanceof Teacher) {
            return userMapper.toTeacherDto((Teacher) blockedUser);
        } else if (blockedUser instanceof Admin) {
            return userMapper.toAdminDto((Admin) blockedUser);
        }
        return userMapper.toDto(blockedUser);
    }
    
    @Override
    @Transactional
    public UserDto unblockUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        
        user.setStatus(UserStatus.ACTIVE);
        User unblockedUser = userRepository.save(user);
        
        if (unblockedUser instanceof Teacher) {
            return userMapper.toTeacherDto((Teacher) unblockedUser);
        } else if (unblockedUser instanceof Admin) {
            return userMapper.toAdminDto((Admin) unblockedUser);
        }
        return userMapper.toDto(unblockedUser);
    }

    @Override
    @Transactional
    public void updatePassword(UUID id, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional
    public BulkUserActionResponse bulkBlockUsers(List<UUID> userIds) {
        List<UUID> successIds = new ArrayList<>();
        List<BulkUserActionResponse.FailedUserAction> failures = new ArrayList<>();

        for (UUID userId : userIds) {
            try {
                Optional<User> userOpt = userRepository.findById(userId);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    user.setStatus(UserStatus.BLOCKED);
                    userRepository.save(user);
                    successIds.add(userId);
                } else {
                    failures.add(BulkUserActionResponse.FailedUserAction.builder()
                            .userId(userId)
                            .reason("Utilisateur non trouvé")
                            .build());
                }
            } catch (Exception e) {
                failures.add(BulkUserActionResponse.FailedUserAction.builder()
                        .userId(userId)
                        .reason(e.getMessage())
                        .build());
            }
        }

        return BulkUserActionResponse.builder()
                .successCount(successIds.size())
                .failureCount(failures.size())
                .successIds(successIds)
                .failures(failures)
                .build();
    }

    @Override
    @Transactional
    public BulkUserActionResponse bulkUnblockUsers(List<UUID> userIds) {
        List<UUID> successIds = new ArrayList<>();
        List<BulkUserActionResponse.FailedUserAction> failures = new ArrayList<>();

        for (UUID userId : userIds) {
            try {
                Optional<User> userOpt = userRepository.findById(userId);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    user.setStatus(UserStatus.ACTIVE);
                    userRepository.save(user);
                    successIds.add(userId);
                } else {
                    failures.add(BulkUserActionResponse.FailedUserAction.builder()
                            .userId(userId)
                            .reason("Utilisateur non trouvé")
                            .build());
                }
            } catch (Exception e) {
                failures.add(BulkUserActionResponse.FailedUserAction.builder()
                        .userId(userId)
                        .reason(e.getMessage())
                        .build());
            }
        }

        return BulkUserActionResponse.builder()
                .successCount(successIds.size())
                .failureCount(failures.size())
                .successIds(successIds)
                .failures(failures)
                .build();
    }
}
