package com.timely.authservice.dto;

import java.time.LocalDateTime;

@lombok.Data
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
@lombok.Builder
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;

    // Constructeurs explicites
    public ErrorResponse() {
    }

    public ErrorResponse(LocalDateTime timestamp, int status, String error, String message, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    public static ErrorResponseBuilder builder() {
        return new ErrorResponseBuilderImpl();
    }

    public interface ErrorResponseBuilder {
        ErrorResponseBuilder timestamp(LocalDateTime timestamp);
        ErrorResponseBuilder status(int status);
        ErrorResponseBuilder error(String error);
        ErrorResponseBuilder message(String message);
        ErrorResponseBuilder path(String path);
        ErrorResponse build();
    }

    public static class ErrorResponseBuilderImpl implements ErrorResponseBuilder {
        private LocalDateTime timestamp;
        private int status;
        private String error;
        private String message;
        private String path;

        @Override
        public ErrorResponseBuilder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        @Override
        public ErrorResponseBuilder status(int status) {
            this.status = status;
            return this;
        }

        @Override
        public ErrorResponseBuilder error(String error) {
            this.error = error;
            return this;
        }

        @Override
        public ErrorResponseBuilder message(String message) {
            this.message = message;
            return this;
        }

        @Override
        public ErrorResponseBuilder path(String path) {
            this.path = path;
            return this;
        }

        @Override
        public ErrorResponse build() {
            return new ErrorResponse(timestamp, status, error, message, path);
        }
    }
}
