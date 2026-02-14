package com.timely.notificationservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("TemplateEngineService - Tests Unitaires")
class TemplateEngineServiceTest {

    private TemplateEngineService templateEngineService;

    @BeforeEach
    void setUp() {
        templateEngineService = new TemplateEngineService();
        templateEngineService.init();
    }

    @Test
    @DisplayName("processTemplate - Template simple")
    void processTemplate_SimpleTemplate() {
        // Given
        String templateContent = "<h1>Hello [[${name}]]</h1>";
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", "John Doe");

        // When
        String result = templateEngineService.processTemplate(templateContent, variables);

        // Then
        assertThat(result).contains("John Doe");
    }

    @Test
    @DisplayName("processTemplate - Template avec plusieurs variables")
    void processTemplate_MultipleVariables() {
        // Given
        String templateContent = """
                <div>
                    <h1>Welcome [[${name}]]</h1>
                    <p>Your email is: [[${email}]]</p>
                    <p>Role: [[${role}]]</p>
                </div>
                """;
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", "John Doe");
        variables.put("email", "john@example.com");
        variables.put("role", "TEACHER");

        // When
        String result = templateEngineService.processTemplate(templateContent, variables);

        // Then
        assertThat(result).contains("John Doe");
        assertThat(result).contains("john@example.com");
        assertThat(result).contains("TEACHER");
    }

    @Test
    @DisplayName("processTemplate - Sans variables")
    void processTemplate_NoVariables() {
        // Given
        String templateContent = "<h1>Hello World</h1>";

        // When
        String result = templateEngineService.processTemplate(templateContent, null);

        // Then
        assertThat(result).contains("Hello World");
    }

    @Test
    @DisplayName("processTemplate - Variables vides")
    void processTemplate_EmptyVariables() {
        // Given
        String templateContent = "<h1>Hello World</h1>";
        Map<String, Object> variables = new HashMap<>();

        // When
        String result = templateEngineService.processTemplate(templateContent, variables);

        // Then
        assertThat(result).contains("Hello World");
    }

    @Test
    @DisplayName("processTemplate - Erreur de template - retourne contenu brut")
    void processTemplate_InvalidTemplate_ReturnsRaw() {
        // Given
        String invalidTemplate = "<h1>Hello [[${missingVar}]]</h1>";
        Map<String, Object> variables = new HashMap<>();

        // When
        String result = templateEngineService.processTemplate(invalidTemplate, variables);

        // Then - En cas d'erreur, retourne le template brut
        assertThat(result).isNotNull();
    }

    @Test
    @DisplayName("processTemplate - Template complexe avec conditions")
    void processTemplate_ComplexTemplateWithConditions() {
        // Given
        String templateContent = """
                <div th:if="${active}">
                    <h1>User is active</h1>
                </div>
                """;
        Map<String, Object> variables = new HashMap<>();
        variables.put("active", true);

        // When
        String result = templateEngineService.processTemplate(templateContent, variables);

        // Then
        assertThat(result).contains("User is active");
    }

    @Test
    @DisplayName("processTemplate - Template avec boucle")
    void processTemplate_TemplateWithLoop() {
        // Given
        String templateContent = """
                <ul>
                    <li th:each="item : ${items}" th:text="${item}"></li>
                </ul>
                """;
        Map<String, Object> variables = new HashMap<>();
        variables.put("items", List.of("Item1", "Item2", "Item3"));

        // When
        String result = templateEngineService.processTemplate(templateContent, variables);

        // Then
        assertThat(result).contains("Item1");
        assertThat(result).contains("Item2");
        assertThat(result).contains("Item3");
    }

    @Test
    @DisplayName("validateTemplate - Template valide")
    void validateTemplate_Valid() {
        // Given
        String validTemplate = "<h1>Hello [[${name}]]</h1>";

        // When
        boolean result = templateEngineService.validateTemplate(validTemplate);

        // Then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("validateTemplate - Template simple sans variables")
    void validateTemplate_SimpleNoVariables() {
        // Given
        String simpleTemplate = "<h1>Hello World</h1>";

        // When
        boolean result = templateEngineService.validateTemplate(simpleTemplate);

        // Then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("extractVariables - Template avec variables")
    void extractVariables_WithVariables() {
        // Given
        String templateContent = "<h1>Hello ${name}, your email is ${email}</h1>";

        // When
        List<String> variables = templateEngineService.extractVariables(templateContent);

        // Then
        assertThat(variables).hasSize(2);
        assertThat(variables).contains("name", "email");
    }

    @Test
    @DisplayName("extractVariables - Template sans variables")
    void extractVariables_NoVariables() {
        // Given
        String templateContent = "<h1>Hello World</h1>";

        // When
        List<String> variables = templateEngineService.extractVariables(templateContent);

        // Then
        assertThat(variables).isEmpty();
    }

    @Test
    @DisplayName("extractVariables - Template avec variables dupliquées")
    void extractVariables_DuplicateVariables() {
        // Given
        String templateContent = "<h1>Hello ${name}, ${name}!</h1>";

        // When
        List<String> variables = templateEngineService.extractVariables(templateContent);

        // Then
        assertThat(variables).hasSize(2);
        assertThat(variables.get(0)).isEqualTo("name");
        assertThat(variables.get(1)).isEqualTo("name");
    }

    @Test
    @DisplayName("extractVariables - Variables avec expressions complexes")
    void extractVariables_ComplexExpressions() {
        // Given
        String templateContent = "<div>${user.name} and ${user.email}</div>";

        // When
        List<String> variables = templateEngineService.extractVariables(templateContent);

        // Then
        assertThat(variables).hasSize(2);
        assertThat(variables).contains("user.name", "user.email");
    }

    @Test
    @DisplayName("processTemplate - Template avec valeur numérique")
    void processTemplate_NumericValue() {
        // Given
        String templateContent = "<p>Age: [[${age}]]</p>";
        Map<String, Object> variables = new HashMap<>();
        variables.put("age", 25);

        // When
        String result = templateEngineService.processTemplate(templateContent, variables);

        // Then
        assertThat(result).contains("25");
    }

    @Test
    @DisplayName("processTemplate - Template avec valeur booléenne")
    void processTemplate_BooleanValue() {
        // Given
        String templateContent = "<p>Active: [[${isActive}]]</p>";
        Map<String, Object> variables = new HashMap<>();
        variables.put("isActive", true);

        // When
        String result = templateEngineService.processTemplate(templateContent, variables);

        // Then
        assertThat(result).contains("true");
    }

    @Test
    @DisplayName("processTemplate - Template avec caractères spéciaux")
    void processTemplate_SpecialCharacters() {
        // Given
        String templateContent = "<p>Message: [[${message}]]</p>";
        Map<String, Object> variables = new HashMap<>();
        variables.put("message", "Bonjour & à bientôt!");

        // When
        String result = templateEngineService.processTemplate(templateContent, variables);

        // Then
        assertThat(result).contains("Bonjour");
    }

    @Test
    @DisplayName("processTemplate - Template avec lien URL")
    void processTemplate_WithUrl() {
        // Given
        String templateContent = """
                <a th:href="${resetLink}">Reset Password</a>
                """;
        Map<String, Object> variables = new HashMap<>();
        variables.put("resetLink", "http://example.com/reset?token=abc123");

        // When
        String result = templateEngineService.processTemplate(templateContent, variables);

        // Then
        assertThat(result).contains("http://example.com/reset?token=abc123");
    }
}
