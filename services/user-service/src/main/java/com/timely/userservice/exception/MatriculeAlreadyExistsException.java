package com.timely.userservice.exception;

public class MatriculeAlreadyExistsException extends RuntimeException {
    public MatriculeAlreadyExistsException(String message) {
        super(message);
    }
}
