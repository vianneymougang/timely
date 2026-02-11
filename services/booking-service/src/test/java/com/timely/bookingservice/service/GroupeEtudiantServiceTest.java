package com.timely.bookingservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.timely.bookingservice.dto.request.GenerateGroupesRequest;
import com.timely.bookingservice.dto.response.GenerateGroupesResponse;
import com.timely.bookingservice.dto.response.GroupeEtudiantResponse;
import com.timely.bookingservice.entity.Classe;
import com.timely.bookingservice.entity.Cours;
import com.timely.bookingservice.entity.Etudiant;
import com.timely.bookingservice.entity.GroupeEtudiant;
import com.timely.bookingservice.entity.enums.TypeCours;
import com.timely.bookingservice.entity.enums.TypeGroupe;
import com.timely.bookingservice.exception.ResourceNotFoundException;
import com.timely.bookingservice.mapper.GroupeEtudiantMapper;
import com.timely.bookingservice.repository.CoursRepository;
import com.timely.bookingservice.repository.EtudiantRepository;
import com.timely.bookingservice.repository.GroupeEtudiantRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * Unit tests for GroupeEtudiantService focusing on automatic group generation (F2.5).
 * Tests validate the algorithm for fair distribution of students across groups.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("GroupeEtudiantService Unit Tests")
class GroupeEtudiantServiceTest {

    @Mock
    private GroupeEtudiantRepository groupeEtudiantRepository;

    @Mock
    private CoursRepository coursRepository;

    @Mock
    private EtudiantRepository etudiantRepository;

    @Mock
    private GroupeEtudiantMapper groupeEtudiantMapper;

    @InjectMocks
    private GroupeEtudiantService groupeEtudiantService;

    @Captor
    private ArgumentCaptor<GroupeEtudiant> groupeEtudiantCaptor;

    private UUID coursId;
    private Cours cours;
    private Classe classe;
    private List<Etudiant> etudiants;

    @BeforeEach
    void setUp() {
        coursId = UUID.randomUUID();
        classe = new Classe();
        classe.setId(UUID.randomUUID());
        classe.setCode("L3-INFO");

        cours = new Cours();
        cours.setId(coursId);
        cours.setIntitule("Programmation Java");
        cours.setClasse(classe);

        // Create list of students
        etudiants = new ArrayList<>();
        classe.setEtudiants(etudiants);
    }

    @Test
    @DisplayName("generateGroupes for CM should create 1 group with all students")
    void generateGroupes_CM_creates1Group() {
        // Arrange
        cours.setTypeCours(TypeCours.CM);
        createStudents(30); // 30 students

        GenerateGroupesRequest request = GenerateGroupesRequest.builder().build();

        when(coursRepository.findById(coursId)).thenReturn(Optional.of(cours));
        when(groupeEtudiantRepository.findByCoursId(coursId)).thenReturn(
            new ArrayList<>()
        );
        when(groupeEtudiantRepository.save(any(GroupeEtudiant.class))).thenAnswer(
            invocation -> invocation.getArgument(0)
        );
        when(groupeEtudiantMapper.toResponse(any(GroupeEtudiant.class))).thenReturn(
            new GroupeEtudiantResponse()
        );

        // Act
        GenerateGroupesResponse response = groupeEtudiantService.generateGroupes(
            coursId,
            request
        );

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getTotalGroupes()).isEqualTo(1);
        assertThat(response.getTotalEtudiants()).isEqualTo(30);
        assertThat(response.getGroupes()).hasSize(1);

        // Verify group creation
        verify(groupeEtudiantRepository, times(1)).save(groupeEtudiantCaptor.capture());
        GroupeEtudiant savedGroupe = groupeEtudiantCaptor.getValue();

        assertThat(savedGroupe.getNumeroGroupe()).isEqualTo(1);
        assertThat(savedGroupe.getTypeGroupe()).isEqualTo(TypeGroupe.SEANCE_COMPLETE);
        assertThat(savedGroupe.getEffectif()).isEqualTo(30);
        assertThat(savedGroupe.getEtudiants()).hasSize(30);
        assertThat(savedGroupe.getCours()).isEqualTo(cours);
    }

    @Test
    @DisplayName("generateGroupes for TD should create 2 groups with fair distribution")
    void generateGroupes_TD_creates2Groups() {
        // Arrange
        cours.setTypeCours(TypeCours.TD);
        createStudents(30); // 30 students

        GenerateGroupesRequest request = GenerateGroupesRequest.builder().build();

        when(coursRepository.findById(coursId)).thenReturn(Optional.of(cours));
        when(groupeEtudiantRepository.findByCoursId(coursId)).thenReturn(
            new ArrayList<>()
        );
        when(groupeEtudiantRepository.save(any(GroupeEtudiant.class))).thenAnswer(
            invocation -> invocation.getArgument(0)
        );
        when(groupeEtudiantMapper.toResponse(any(GroupeEtudiant.class))).thenReturn(
            new GroupeEtudiantResponse()
        );

        // Act
        GenerateGroupesResponse response = groupeEtudiantService.generateGroupes(
            coursId,
            request
        );

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getTotalGroupes()).isEqualTo(2);
        assertThat(response.getTotalEtudiants()).isEqualTo(30);
        assertThat(response.getGroupes()).hasSize(2);

        // Verify groups creation
        verify(groupeEtudiantRepository, times(2)).save(groupeEtudiantCaptor.capture());
        List<GroupeEtudiant> savedGroupes = groupeEtudiantCaptor.getAllValues();

        // Group 1: 15 students
        assertThat(savedGroupes.get(0).getNumeroGroupe()).isEqualTo(1);
        assertThat(savedGroupes.get(0).getTypeGroupe()).isEqualTo(TypeGroupe.DEMI_GROUPE);
        assertThat(savedGroupes.get(0).getEffectif()).isEqualTo(15);
        assertThat(savedGroupes.get(0).getEtudiants()).hasSize(15);

        // Group 2: 15 students
        assertThat(savedGroupes.get(1).getNumeroGroupe()).isEqualTo(2);
        assertThat(savedGroupes.get(1).getTypeGroupe()).isEqualTo(TypeGroupe.DEMI_GROUPE);
        assertThat(savedGroupes.get(1).getEffectif()).isEqualTo(15);
        assertThat(savedGroupes.get(1).getEtudiants()).hasSize(15);
    }

    @Test
    @DisplayName("generateGroupes for TP should create 3 groups with fair distribution")
    void generateGroupes_TP_creates3Groups() {
        // Arrange
        cours.setTypeCours(TypeCours.TP);
        createStudents(30); // 30 students

        GenerateGroupesRequest request = GenerateGroupesRequest.builder().build();

        when(coursRepository.findById(coursId)).thenReturn(Optional.of(cours));
        when(groupeEtudiantRepository.findByCoursId(coursId)).thenReturn(
            new ArrayList<>()
        );
        when(groupeEtudiantRepository.save(any(GroupeEtudiant.class))).thenAnswer(
            invocation -> invocation.getArgument(0)
        );
        when(groupeEtudiantMapper.toResponse(any(GroupeEtudiant.class))).thenReturn(
            new GroupeEtudiantResponse()
        );

        // Act
        GenerateGroupesResponse response = groupeEtudiantService.generateGroupes(
            coursId,
            request
        );

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getTotalGroupes()).isEqualTo(3);
        assertThat(response.getTotalEtudiants()).isEqualTo(30);
        assertThat(response.getGroupes()).hasSize(3);

        // Verify groups creation
        verify(groupeEtudiantRepository, times(3)).save(groupeEtudiantCaptor.capture());
        List<GroupeEtudiant> savedGroupes = groupeEtudiantCaptor.getAllValues();

        // Each group should have 10 students (30 / 3 = 10)
        for (int i = 0; i < 3; i++) {
            assertThat(savedGroupes.get(i).getNumeroGroupe()).isEqualTo(i + 1);
            assertThat(savedGroupes.get(i).getTypeGroupe()).isEqualTo(
                TypeGroupe.TIERS_GROUPE
            );
            assertThat(savedGroupes.get(i).getEffectif()).isEqualTo(10);
            assertThat(savedGroupes.get(i).getEtudiants()).hasSize(10);
        }
    }

    @Test
    @DisplayName("generateGroupes with custom number should create requested groups")
    void generateGroupes_customNumber_createsRequestedGroups() {
        // Arrange
        cours.setTypeCours(TypeCours.TP);
        createStudents(20); // 20 students

        // Request 4 groups instead of default 3 for TP
        GenerateGroupesRequest request = GenerateGroupesRequest.builder()
            .nombreGroupes(4)
            .build();

        when(coursRepository.findById(coursId)).thenReturn(Optional.of(cours));
        when(groupeEtudiantRepository.findByCoursId(coursId)).thenReturn(
            new ArrayList<>()
        );
        when(groupeEtudiantRepository.save(any(GroupeEtudiant.class))).thenAnswer(
            invocation -> invocation.getArgument(0)
        );
        when(groupeEtudiantMapper.toResponse(any(GroupeEtudiant.class))).thenReturn(
            new GroupeEtudiantResponse()
        );

        // Act
        GenerateGroupesResponse response = groupeEtudiantService.generateGroupes(
            coursId,
            request
        );

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getTotalGroupes()).isEqualTo(4);
        assertThat(response.getTotalEtudiants()).isEqualTo(20);
        assertThat(response.getGroupes()).hasSize(4);

        // Verify 4 groups were created
        verify(groupeEtudiantRepository, times(4)).save(groupeEtudiantCaptor.capture());
        List<GroupeEtudiant> savedGroupes = groupeEtudiantCaptor.getAllValues();

        // Each group should have 5 students (20 / 4 = 5)
        for (int i = 0; i < 4; i++) {
            assertThat(savedGroupes.get(i).getNumeroGroupe()).isEqualTo(i + 1);
            assertThat(savedGroupes.get(i).getEffectif()).isEqualTo(5);
            assertThat(savedGroupes.get(i).getEtudiants()).hasSize(5);
        }
    }

    @Test
    @DisplayName("generateGroupes should distribute students fairly when there is a remainder")
    void generateGroupes_distributesFairly_withRemainder() {
        // Arrange
        cours.setTypeCours(TypeCours.TP);
        createStudents(32); // 32 students (32 / 3 = 10 remainder 2)

        GenerateGroupesRequest request = GenerateGroupesRequest.builder().build();

        when(coursRepository.findById(coursId)).thenReturn(Optional.of(cours));
        when(groupeEtudiantRepository.findByCoursId(coursId)).thenReturn(
            new ArrayList<>()
        );
        when(groupeEtudiantRepository.save(any(GroupeEtudiant.class))).thenAnswer(
            invocation -> invocation.getArgument(0)
        );
        when(groupeEtudiantMapper.toResponse(any(GroupeEtudiant.class))).thenReturn(
            new GroupeEtudiantResponse()
        );

        // Act
        GenerateGroupesResponse response = groupeEtudiantService.generateGroupes(
            coursId,
            request
        );

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getTotalGroupes()).isEqualTo(3);
        assertThat(response.getTotalEtudiants()).isEqualTo(32);

        // Verify groups creation and fair distribution
        verify(groupeEtudiantRepository, times(3)).save(groupeEtudiantCaptor.capture());
        List<GroupeEtudiant> savedGroupes = groupeEtudiantCaptor.getAllValues();

        // First 2 groups get 11 students each (base + 1 from remainder)
        // Last group gets 10 students (base only)
        // Algorithm: first N groups get remainder students where N = remainder
        assertThat(savedGroupes.get(0).getNumeroGroupe()).isEqualTo(1);
        assertThat(savedGroupes.get(0).getEffectif()).isEqualTo(11); // 10 + 1
        assertThat(savedGroupes.get(0).getEtudiants()).hasSize(11);

        assertThat(savedGroupes.get(1).getNumeroGroupe()).isEqualTo(2);
        assertThat(savedGroupes.get(1).getEffectif()).isEqualTo(11); // 10 + 1
        assertThat(savedGroupes.get(1).getEtudiants()).hasSize(11);

        assertThat(savedGroupes.get(2).getNumeroGroupe()).isEqualTo(3);
        assertThat(savedGroupes.get(2).getEffectif()).isEqualTo(10); // 10 + 0
        assertThat(savedGroupes.get(2).getEtudiants()).hasSize(10);

        // Verify total distribution
        int totalDistributed =
            savedGroupes.get(0).getEffectif() +
            savedGroupes.get(1).getEffectif() +
            savedGroupes.get(2).getEffectif();
        assertThat(totalDistributed).isEqualTo(32);
    }

    @Test
    @DisplayName("generateGroupes should delete existing groups first")
    void generateGroupes_deletesExistingGroupsFirst() {
        // Arrange
        cours.setTypeCours(TypeCours.TD);
        createStudents(20); // 20 students

        // Create existing groups
        List<GroupeEtudiant> existingGroupes = new ArrayList<>();
        GroupeEtudiant existingGroupe1 = new GroupeEtudiant();
        existingGroupe1.setId(UUID.randomUUID());
        existingGroupe1.setCours(cours);
        existingGroupes.add(existingGroupe1);

        GroupeEtudiant existingGroupe2 = new GroupeEtudiant();
        existingGroupe2.setId(UUID.randomUUID());
        existingGroupe2.setCours(cours);
        existingGroupes.add(existingGroupe2);

        GenerateGroupesRequest request = GenerateGroupesRequest.builder().build();

        when(coursRepository.findById(coursId)).thenReturn(Optional.of(cours));
        when(groupeEtudiantRepository.findByCoursId(coursId)).thenReturn(
            existingGroupes
        );
        when(groupeEtudiantRepository.save(any(GroupeEtudiant.class))).thenAnswer(
            invocation -> invocation.getArgument(0)
        );
        when(groupeEtudiantMapper.toResponse(any(GroupeEtudiant.class))).thenReturn(
            new GroupeEtudiantResponse()
        );

        // Act
        GenerateGroupesResponse response = groupeEtudiantService.generateGroupes(
            coursId,
            request
        );

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getTotalGroupes()).isEqualTo(2);
        assertThat(response.getTotalEtudiants()).isEqualTo(20);

        // Verify existing groups were deleted
        verify(groupeEtudiantRepository, times(1)).deleteAll(existingGroupes);

        // Verify new groups were created
        verify(groupeEtudiantRepository, times(2)).save(any(GroupeEtudiant.class));
    }

    @Test
    @DisplayName("generateGroupes should throw exception when course not found")
    void generateGroupes_shouldThrowException_whenCourseNotFound() {
        // Arrange
        UUID nonExistentCoursId = UUID.randomUUID();
        GenerateGroupesRequest request = GenerateGroupesRequest.builder().build();

        when(coursRepository.findById(nonExistentCoursId)).thenReturn(
            Optional.empty()
        );

        // Act & Assert
        assertThatThrownBy(() ->
            groupeEtudiantService.generateGroupes(nonExistentCoursId, request)
        )
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Cours non trouvé avec l'id: " + nonExistentCoursId);

        // Verify no groups were created
        verify(groupeEtudiantRepository, never()).save(any(GroupeEtudiant.class));
    }

    @Test
    @DisplayName("generateGroupes should throw exception when class has no students")
    void generateGroupes_shouldThrowException_whenNoStudents() {
        // Arrange
        cours.setTypeCours(TypeCours.TD);
        // Don't add any students - etudiants list is empty

        GenerateGroupesRequest request = GenerateGroupesRequest.builder().build();

        when(coursRepository.findById(coursId)).thenReturn(Optional.of(cours));

        // Act & Assert
        assertThatThrownBy(() ->
            groupeEtudiantService.generateGroupes(coursId, request)
        )
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("No students found in class");

        // Verify no groups were created
        verify(groupeEtudiantRepository, never()).save(any(GroupeEtudiant.class));
    }

    /**
     * Helper method to create a specified number of students.
     */
    private void createStudents(int count) {
        for (int i = 1; i <= count; i++) {
            Etudiant etudiant = new Etudiant();
            etudiant.setId(UUID.randomUUID());
            etudiant.setMatricule("ETU" + String.format("%03d", i));
            etudiant.setNom("Student" + i);
            etudiant.setPrenom("Test" + i);
            etudiant.setClasse(classe);
            etudiants.add(etudiant);
        }
    }
}
