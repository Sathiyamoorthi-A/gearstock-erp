package com.gearstock.dto;


public class RegisterRequest {

    private String username;

    private String email;

    private String password;

    private String fullName;

    private String role;

    private String department;

    public RegisterRequest() {
    }

    public RegisterRequest(String username, String email, String password, String fullName, String role, String department) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.department = department;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return this.fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return this.role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDepartment() {
        return this.department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public static RegisterRequestBuilder builder() {
        return new RegisterRequestBuilder();
    }

    public static class RegisterRequestBuilder {
        private String username;
        private String email;
        private String password;
        private String fullName;
        private String role;
        private String department;

        public RegisterRequestBuilder username(String username) {
            this.username = username;
            return this;
        }

        public RegisterRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public RegisterRequestBuilder password(String password) {
            this.password = password;
            return this;
        }

        public RegisterRequestBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public RegisterRequestBuilder role(String role) {
            this.role = role;
            return this;
        }

        public RegisterRequestBuilder department(String department) {
            this.department = department;
            return this;
        }

        public RegisterRequest build() {
            return new RegisterRequest(this.username, this.email, this.password, this.fullName, this.role, this.department);
        }
    }
}
