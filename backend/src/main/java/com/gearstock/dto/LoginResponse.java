package com.gearstock.dto;


public class LoginResponse {

    private String token;

    private String username;

    private String fullName;

    private String role;

    private String department;

    public LoginResponse() {
    }

    public LoginResponse(String token, String username, String fullName, String role, String department) {
        this.token = token;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.department = department;
    }

    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public static LoginResponseBuilder builder() {
        return new LoginResponseBuilder();
    }

    public static class LoginResponseBuilder {
        private String token;
        private String username;
        private String fullName;
        private String role;
        private String department;

        public LoginResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public LoginResponseBuilder username(String username) {
            this.username = username;
            return this;
        }

        public LoginResponseBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public LoginResponseBuilder role(String role) {
            this.role = role;
            return this;
        }

        public LoginResponseBuilder department(String department) {
            this.department = department;
            return this;
        }

        public LoginResponse build() {
            return new LoginResponse(this.token, this.username, this.fullName, this.role, this.department);
        }
    }
}
