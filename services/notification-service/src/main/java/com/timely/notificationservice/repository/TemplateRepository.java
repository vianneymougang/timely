package com.timely.notificationservice.repository;

import com.timely.notificationservice.document.Template;
import com.timely.notificationservice.document.enums.TypeNotification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TemplateRepository extends MongoRepository<Template, String> {

    Optional<Template> findByTypeNotificationAndActifTrue(TypeNotification typeNotification);

    List<Template> findByActifTrue();

    boolean existsByNom(String nom);
}
