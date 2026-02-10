package com.timely.userservice.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timely.userservice.dto.AdminDto;
import com.timely.userservice.dto.CreateAdminRequest;
import com.timely.userservice.dto.CreateTeacherRequest;
import com.timely.userservice.dto.InternalUserDto;
import com.timely.userservice.dto.TeacherDto;
import com.timely.userservice.dto.UpdateUserRequest;
import com.timely.userservice.dto.UserDto;
import com.timely.userservice.exception.ResourceNotFoundException;
import com.timely.userservice.mapper.UserMapper;
import com.timely.userservice.model.Admin;
import com.timely.userservice.model.Teacher;
import com.timely.userservice.model.User;
import com.timely.userservice.repository.TeacherRepository;
import com.timely.userservice.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    // Constructeur
    public UserServiceImpl(UserRepository userRepository, TeacherRepository teacherRepository, 
                         PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    @Override
    public TeacherDto createTeacher(CreateTeacherRequest request) {
        Teacher teacher = userMapper.toTeacherEntity(request);
        // Générer un mot de passe par défaut ou en attendre un du request
        // Pour maintenant, générer un mot de passe temporaire
        String temporaryPassword = UUID.randomUUID().toString().substring(0, 12);
        teacher.setPassword(passwordEncoder.encode(temporaryPassword));
        teacher.setIsActive(true);
        teacherRepository.save(teacher);
        return userMapper.toTeacherDto(teacher);
    }

    @Override
    public AdminDto createAdmin(CreateAdminRequest request) {
        Admin admin = userMapper.toAdminEntity(request);
        // Générer un mot de passe par défaut ou en attendre un du request
        String temporaryPassword = UUID.randomUUID().toString().substring(0, 12);
        admin.setPassword(passwordEncoder.encode(temporaryPassword));
        admin.setIsActive(true);
        userRepository.save(admin);
        return userMapper.toAdminDto(admin);
    }

    @Override
    public UserDto getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return convertToDto(user);
    }

    @Override
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return convertToDto(user);
    }

    @Override
    public InternalUserDto getInternalUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return convertToInternalDto(user);
    }

    @Override
    public InternalUserDto getInternalUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return convertToInternalDto(user);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TeacherDto> getAllTeachers() {
        return teacherRepository.findAll()
                .stream()
                .map(userMapper::toTeacherDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto updateUser(UUID userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        if (request.getName() != null) {
            user.setFirstName(request.getName());
        }
        if (request.getSurname() != null) {
            user.setLastName(request.getSurname());
        }
        // telephoneNumber not present on current User model; skip if provided
        
        userRepository.save(user);
        return convertToDto(user);
    }

    @Override
    @Transactional
    public void deleteUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        // Soft delete: mark inactive
        user.setIsActive(false);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserDto blockUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setIsActive(false);
        userRepository.save(user);
        return convertToDto(user);
    }

    @Override
    @Transactional
    public UserDto unblockUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setIsActive(true);
        userRepository.save(user);
        return convertToDto(user);
    }

    @Override
    @Transactional
    public void updatePassword(UUID userId, String currentPassword, String newPassword) {
        // Récupérer l'utilisateur
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // ✅ Vérifier que le mot de passe actuel est correct
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // ✅ Hasher et sauvegarder le nouveau mot de passe
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // Méthode utilitaire pour convertir User en UserDto
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRole(user.getRole());
        // Ne jamais renvoyer le mot de passe !
        return dto;
    }

    // Méthode utilitaire pour convertir User en InternalUserDto
    // Méthode utilitaire pour convertir User en InternalUserDto
    private InternalUserDto convertToInternalDto(User user) {
        InternalUserDto dto = new InternalUserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getFirstName());
        dto.setSurname(user.getLastName());
        dto.setPassword(user.getPassword());  // Inclut le mot de passe hashé pour usage interne
        dto.setRole(user.getRole());
        dto.setStatus(user.getIsActive());
        dto.setCreationDate(user.getCreatedAt());
        return dto;
    }
}