package com.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;

public class TaskDto {
    @NotBlank
    private String title;
    private String description;
    private boolean completed;

    // Constructeurs
    public TaskDto() {}

    public TaskDto(String title, String description, boolean completed) {
        this.title = title;
        this.description = description;
        this.completed = completed;
    }

    // Getters et Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}