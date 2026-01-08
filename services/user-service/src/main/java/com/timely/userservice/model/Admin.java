package com.timely.userservice.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;

@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends User {
    @NotNull
    private Integer accessLevel;

    @NotNull
    private Integer department;
<<<<<<< HEAD:services/auth-service/src/main/java/com/timely/authservice/model/Admin.java

    // Getters and Setters
    public Integer getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(Integer accessLevel) {
        this.accessLevel = accessLevel;
    }

    public Integer getDepartment() {
        return department;
    }

    public void setDepartment(Integer department) {
        this.department = department;
    }
=======
>>>>>>> 0ea8e076f89dd6ae6a11210df6b146a8af9075d8:services/user-service/src/main/java/com/timely/userservice/model/Admin.java
}
