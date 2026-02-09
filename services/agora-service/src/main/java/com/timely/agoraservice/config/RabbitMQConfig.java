package com.timely.agoraservice.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String QUEUE_NAME = "agora.planning.published.queue";
    public static final String EXCHANGE_NAME = "planning.exchange";
    public static final String ROUTING_KEY = "planning.published";

    @Bean
    public Queue agoraPlanningPublishedQueue() {
        return new Queue(QUEUE_NAME, true);
    }

    @Bean
    public TopicExchange planningExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Binding agoraPlanningBinding(Queue agoraPlanningPublishedQueue, TopicExchange planningExchange) {
        return BindingBuilder
                .bind(agoraPlanningPublishedQueue)
                .to(planningExchange)
                .with(ROUTING_KEY);
    }
}
