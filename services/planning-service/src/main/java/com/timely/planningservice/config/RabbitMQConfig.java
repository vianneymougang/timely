package com.timely.planningservice.config;

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

    public static final String PLANNING_EXCHANGE = "planning.events";
    public static final String PLANNING_PUBLISHED_QUEUE = "planning.published.queue";
    public static final String PLANNING_CONFLICT_QUEUE = "planning.conflict.queue";
    public static final String PLANNING_PUBLISHED_ROUTING_KEY = "planning.published";
    public static final String PLANNING_CONFLICT_ROUTING_KEY = "planning.conflict.detected";

    @Bean
    public TopicExchange planningExchange() {
        return new TopicExchange(PLANNING_EXCHANGE);
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
    public Binding planningPublishedBinding(Queue planningPublishedQueue, TopicExchange planningExchange) {
        return BindingBuilder
                .bind(planningPublishedQueue)
                .to(planningExchange)
                .with(PLANNING_PUBLISHED_ROUTING_KEY);
    }

    @Bean
    public Binding planningConflictBinding(Queue planningConflictQueue, TopicExchange planningExchange) {
        return BindingBuilder
                .bind(planningConflictQueue)
                .to(planningExchange)
                .with(PLANNING_CONFLICT_ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
                                         MessageConverter jsonMessageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter);
        return template;
    }
}
