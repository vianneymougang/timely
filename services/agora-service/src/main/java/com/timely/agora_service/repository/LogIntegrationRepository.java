package com.timely.agora_service.repository;

import com.timely.agora_service.entity.ExportAgora;
import com.timely.agora_service.entity.LogIntegration;
import com.timely.agora_service.entity.enums.TypeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface LogIntegrationRepository extends JpaRepository<LogIntegration, UUID> {

    List<LogIntegration> findByExportAgora(ExportAgora exportAgora);

    List<LogIntegration> findByTypeLog(TypeLog typeLog);

    List<LogIntegration> findByTimestampBetween(LocalDateTime debut, LocalDateTime fin);

    List<LogIntegration> findByExportAgoraOrderByTimestampDesc(ExportAgora exportAgora);
}
