package com.timely.notificationservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.templateresolver.StringTemplateResolver;

import jakarta.annotation.PostConstruct;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class TemplateEngineService {

    private final SpringTemplateEngine templateEngine = new SpringTemplateEngine();

    @PostConstruct
    public void init() {
        StringTemplateResolver templateResolver = new StringTemplateResolver();
        templateResolver.setTemplateMode("HTML");
        templateEngine.setTemplateResolver(templateResolver);
        log.info("Thymeleaf template engine initialized");
    }

    /**
     * Traiter un template avec des variables
     */
    public String processTemplate(String templateContent, Map<String, Object> variables) {
        try {
            Context context = new Context();
            if (variables != null) {
                variables.forEach(context::setVariable);
            }

            return templateEngine.process(templateContent, context);
        } catch (Exception e) {
            log.error("Error processing template", e);
            return templateContent; // Retourner le template brut en cas d'erreur
        }
    }

    /**
     * Valider un template
     */
    public boolean validateTemplate(String templateContent) {
        try {
            Context context = new Context();
            templateEngine.process(templateContent, context);
            return true;
        } catch (Exception e) {
            log.error("Template validation failed", e);
            return false;
        }
    }

    /**
     * Extraire les variables d'un template
     */
    public java.util.List<String> extractVariables(String templateContent) {
        java.util.List<String> variables = new java.util.ArrayList<>();

        try {
            // Extraire les variables Thymeleaf ${variable}
            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\$\\{([^}]+)\\}");
            java.util.regex.Matcher matcher = pattern.matcher(templateContent);

            while (matcher.find()) {
                variables.add(matcher.group(1));
            }
        } catch (Exception e) {
            log.error("Error extracting variables from template", e);
        }

        return variables;
    }
}
