package com.taskmanager.controller;

import com.taskmanager.dto.TaskDto;
import com.taskmanager.model.Task;
import com.taskmanager.model.User;
import com.taskmanager.service.TaskService;
import com.taskmanager.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(Authentication authentication) {
        String username = authentication.getName();
        Optional<User> user = userService.findByUsername(username);

        if (user.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<Task> tasks = taskService.findAllByUserId(user.get().getId());
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskDto taskDto,
                                           Authentication authentication) {
        String username = authentication.getName();
        Optional<User> user = userService.findByUsername(username);

        if (user.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Task task = new Task(taskDto.getTitle(), taskDto.getDescription(), user.get().getId());
        task.setCompleted(taskDto.isCompleted());

        Task savedTask = taskService.save(task);
        return ResponseEntity.ok(savedTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id,
                                           @Valid @RequestBody TaskDto taskDto,
                                           Authentication authentication) {
        String username = authentication.getName();
        Optional<User> user = userService.findByUsername(username);
        Optional<Task> taskOptional = taskService.findById(id);

        if (user.isEmpty() || taskOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Task task = taskOptional.get();

        // Vérifier que la tâche appartient à l'utilisateur
        if (!task.getUserId().equals(user.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setCompleted(taskDto.isCompleted());

        Task updatedTask = taskService.save(task);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable String id, Authentication authentication) {
        String username = authentication.getName();
        Optional<User> user = userService.findByUsername(username);
        Optional<Task> taskOptional = taskService.findById(id);

        if (user.isEmpty() || taskOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Task task = taskOptional.get();

        // Vérifier que la tâche appartient à l'utilisateur
        if (!task.getUserId().equals(user.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

        }

        taskService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/completed/{completed}")
    public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable boolean completed,
                                                       Authentication authentication) {
        String username = authentication.getName();
        Optional<User> user = userService.findByUsername(username);

        if (user.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<Task> tasks = taskService.findByUserIdAndCompleted(user.get().getId(), completed);
        return ResponseEntity.ok(tasks);
    }
}