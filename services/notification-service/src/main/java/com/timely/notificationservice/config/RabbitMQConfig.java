package com.timely.notificationservice.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    
    // Password reset events
    public static final String EXCHANGE = "timely.notifications";
    public static final String PASSWORD_RESET_QUEUE = "password-reset-email-queue";
    public static final String PASSWORD_RESET_ROUTING_KEY = "password.reset";
    
    // User creation events
    public static final String USER_EXCHANGE = "user.events";
    public static final String USER_CREATED_QUEUE = "user.created.queue";
    public static final String USER_CREATED_ROUTING_KEY = "user.created";

    // Planning events
    public static final String PLANNING_EXCHANGE = "planning.events";
    public static final String PLANNING_PUBLISHED_QUEUE = "planning.published.queue";
    public static final String PLANNING_PUBLISHED_ROUTING_KEY = "planning.published";
    public static final String PLANNING_CONFLICT_QUEUE = "planning.conflict.queue";
    public static final String PLANNING_CONFLICT_ROUTING_KEY = "planning.conflict.detected";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }
    
    @Bean
    public TopicExchange userExchange() {
        return new TopicExchange(USER_EXCHANGE);
    }

    @Bean
    public TopicExchange planningExchange() {
        return new TopicExchange(PLANNING_EXCHANGE);
    }

    @Bean
    public Queue passwordResetQueue() {
        return new Queue(PASSWORD_RESET_QUEUE, true);
    }

    @Bean
    public Queue userCreatedQueue() {
        return new Queue(USER_CREATED_QUEUE, true);
    }

    @Bean
    public Queue planningPublishedQueue() {
        return new Queue(PLANNING_PUBLISHED_QUEUE, true);
    }

    @Bean
    public Queue planningConflictQueue() {
        return new Queue(PLANNING_CONFLICT_QUEUE, true);
    }

    @Bean
    public Binding passwordResetBinding(Queue passwordResetQueue, TopicExchange exchange) {
        return BindingBuilder.bind(passwordResetQueue).to(exchange).with(PASSWORD_RESET_ROUTING_KEY);
    }

    @Bean
    public Binding userCreatedBinding(Queue userCreatedQueue, TopicExchange userExchange) {
        return BindingBuilder.bind(userCreatedQueue).to(userExchange).with(USER_CREATED_ROUTING_KEY);
    }

    @Bean
    public Binding planningPublishedBinding(Queue planningPublishedQueue, TopicExchange planningExchange) {
        return BindingBuilder.bind(planningPublishedQueue).to(planningExchange).with(PLANNING_PUBLISHED_ROUTING_KEY);
    }

    @Bean
    public Binding planningConflictBinding(Queue planningConflictQueue, TopicExchange planningExchange) {
        return BindingBuilder.bind(planningConflictQueue).to(planningExchange).with(PLANNING_CONFLICT_ROUTING_KEY);
    }
    
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
