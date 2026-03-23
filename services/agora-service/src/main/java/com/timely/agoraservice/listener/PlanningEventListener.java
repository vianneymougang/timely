package com.timely.agoraservice.listener;

import com.timely.agoraservice.dto.event.EmploiDuTempsPublieEvent;
import com.timely.agoraservice.dto.request.ExportRequest;
import com.timely.agoraservice.dto.response.ExportAgoraResponse;
import com.timely.agoraservice.entity.enums.FormatExportAgora;
import com.timely.agoraservice.service.AgoraExportService;
import com.timely.agoraservice.service.ExportAgoraService;
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
