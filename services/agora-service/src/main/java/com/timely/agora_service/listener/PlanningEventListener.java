package com.timely.agora_service.listener;

import com.timely.agora_service.dto.event.EmploiDuTempsPublieEvent;
import com.timely.agora_service.dto.request.ExportRequest;
import com.timely.agora_service.dto.response.ExportAgoraResponse;
import com.timely.agora_service.entity.enums.FormatExportAgora;
import com.timely.agora_service.service.AgoraExportService;
import com.timely.agora_service.service.ExportAgoraService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class PlanningEventListener {

    private final ExportAgoraService exportAgoraService;
    private final AgoraExportService agoraExportService;

    @RabbitListener(queues = "agora.planning.published.queue")
    public void handleEmploiPublie(EmploiDuTempsPublieEvent event) {
        log.info("Received EmploiDuTempsPublieEvent for emploi: {}", event.getEmploiDuTempsId());

        try {
            // Créer un export automatique en format JSON par défaut
            ExportRequest request = new ExportRequest();
            request.setEmploiDuTempsId(event.getEmploiDuTempsId());
            request.setFormat(FormatExportAgora.JSON);

            // Créer l'export dans la DB
            ExportAgoraResponse export = exportAgoraService.createExport(request);

            // Déclencher l'envoi vers Agora en asynchrone
            agoraExportService.exportToAgoraAsync(export.getId());

            log.info("Export automatique créé et envoyé vers Agora pour emploi: {}", event.getEmploiDuTempsId());

        } catch (Exception e) {
            log.error("Erreur lors du traitement de l'événement emploi publié: {}", event.getEmploiDuTempsId(), e);
            // Ne pas relancer l'exception pour éviter le retry infini RabbitMQ
        }
    }
}
