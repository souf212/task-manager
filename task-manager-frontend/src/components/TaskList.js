import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Checkbox,
    Chip,
    Fab,
    AppBar,
    Toolbar,
    Tabs,
    Tab
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { taskService, authService } from '../services/api';
import TaskDialog from './TaskDialog';

const TaskList = ({ onLogout }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [filteredTasks, setFilteredTasks] = useState([]);

    const user = authService.getCurrentUser();

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        filterTasks();
    }, [tasks, tabValue]);

    const fetchTasks = async () => {
        try {
            const response = await taskService.getAllTasks();
            setTasks(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des tâches:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterTasks = useCallback(() => {
        switch (tabValue) {
            case 0: // Toutes
                setFilteredTasks(tasks);
                break;
            case 1: // En cours
                setFilteredTasks(tasks.filter(task => !task.completed));
                break;
            case 2: // Terminées
                setFilteredTasks(tasks.filter(task => task.completed));
                break;
            default:
                setFilteredTasks(tasks);
        }
    }, [tasks, tabValue]);
    useEffect(() => {
        filterTasks();
    }, [filterTasks]);
    const handleCreateTask = () => {
        setCurrentTask(null);
        setDialogOpen(true);
    };

    const handleEditTask = (task) => {
        setCurrentTask(task);
        setDialogOpen(true);
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
            try {
                await taskService.deleteTask(taskId);
                fetchTasks();
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
            }
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            await taskService.updateTask(task.id, {
                ...task,
                completed: !task.completed
            });
            fetchTasks();
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
        }
    };

    const handleTaskSaved = () => {
        setDialogOpen(false);
        fetchTasks();
    };

    const handleLogout = () => {
        authService.logout();
        onLogout();
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (loading) {
        return <Typography>Chargement...</Typography>;
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Gestionnaire de Tâches - {user.username}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                        Déconnexion
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 2 }}>
                <Paper elevation={3}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} centered>
                            <Tab label="Toutes" />
                            <Tab label="En cours" />
                            <Tab label="Terminées" />
                        </Tabs>
                    </Box>

                    <Box p={2}>
                        {filteredTasks.length === 0 ? (
                            <Typography variant="body1" align="center" color="textSecondary">
                                Aucune tâche trouvée
                            </Typography>
                        ) : (
                            <List>
                                {filteredTasks.map((task) => (
                                    <ListItem key={task.id} divider>
                                        <Checkbox
                                            checked={task.completed}
                                            onChange={() => handleToggleComplete(task)}
                                            color="primary"
                                        />
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Typography
                                                        variant="h6"
                                                        style={{
                                                            textDecoration: task.completed ? 'line-through' : 'none',
                                                            color: task.completed ? 'gray' : 'inherit'
                                                        }}
                                                    >
                                                        {task.title}
                                                    </Typography>
                                                    <Chip
                                                        label={task.completed ? 'Terminée' : 'En cours'}
                                                        color={task.completed ? 'success' : 'primary'}
                                                        size="small"
                                                    />
                                                </Box>
                                            }
                                            secondary={task.description}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" onClick={() => handleEditTask(task)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                </Paper>

                <Fab
                    color="primary"
                    aria-label="add"
                    onClick={handleCreateTask}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                    }}
                >
                    <AddIcon />
                </Fab>

                <TaskDialog
                    open={dialogOpen}
                    task={currentTask}
                    onClose={() => setDialogOpen(false)}
                    onSave={handleTaskSaved}
                />
            </Container>
        </>
    );
};

export default TaskList;