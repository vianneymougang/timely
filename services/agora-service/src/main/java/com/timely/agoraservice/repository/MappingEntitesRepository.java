package com.timely.agoraservice.repository;

import com.timely.agoraservice.entity.MappingEntites;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MappingEntitesRepository extends JpaRepository<MappingEntites, UUID> {

    Optional<MappingEntites> findByEntiteLocaleTypeAndEntiteLocaleId(String type, UUID id);

    List<MappingEntites> findByEntiteLocaleType(String type);

    Optional<MappingEntites> findByEntiteAgoraId(String agoraId);

    List<MappingEntites> findByTypeMapping(String typeMapping);

    boolean existsByEntiteLocaleTypeAndEntiteLocaleId(String type, UUID id);
}
