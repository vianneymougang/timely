package com.timely.authservice.config;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * RabbitMQ Configuration for Auth Service
 * Configures exchange and message converter for password reset events
 */
@Configuration
public class RabbitMQConfig {
    
    // Password reset events exchange
    public static final String EXCHANGE = "timely.notifications";
    public static final String PASSWORD_RESET_ROUTING_KEY = "password.reset";
    
    /**
     * Define the topic exchange for notifications
     */
    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }
    
    /**
     * Configure JSON message converter for event serialization
     */
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    
    /**
     * Configure RabbitTemplate with JSON converter
     */
    @Bean
    public RabbitTemplate rabbitTemplate(@org.springframework.lang.NonNull ConnectionFactory connectionFactory, 
                                         @org.springframework.lang.NonNull MessageConverter jsonMessageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter);
        return template;
    }
}
