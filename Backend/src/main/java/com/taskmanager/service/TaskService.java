package com.taskmanager.service;

import com.taskmanager.model.Task;
import com.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> findAllByUserId(String userId) {
        return taskRepository.findByUserId(userId);
    }

    public Optional<Task> findById(String id) {
        return taskRepository.findById(id);
    }

    public Task save(Task task) {
        if (task.getId() != null) {
            task.setUpdatedAt(LocalDateTime.now());
        }
        return taskRepository.save(task);
    }

    public void deleteById(String id) {
        taskRepository.deleteById(id);
    }

    public List<Task> findByUserIdAndCompleted(String userId, boolean completed) {
        return taskRepository.findByUserIdAndCompleted(userId, completed);
    }
}