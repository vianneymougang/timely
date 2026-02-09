package com.timely.agoraservice.repository;

import com.timely.agoraservice.entity.ExportAgora;
import com.timely.agoraservice.entity.LogIntegration;
import com.timely.agoraservice.entity.enums.TypeLog;
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
