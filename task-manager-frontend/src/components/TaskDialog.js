import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Alert
} from '@mui/material';
import { taskService } from '../services/api';

const TaskDialog = ({ open, task, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        completed: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                completed: task.completed || false
            });
        } else {
            setFormData({
                title: '',
                description: '',
                completed: false
            });
        }
        setError('');
    }, [task, open]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (task) {
                await taskService.updateTask(task.id, formData);
            } else {
                await taskService.createTask(formData);
            }
            onSave();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {task ? 'Modifier la tâche' : 'Nouvelle tâche'}
                </DialogTitle>

                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Titre"
                        type="text"
                        fullWidth
                        variant="outlined"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="completed"
                                checked={formData.completed}
                                onChange={handleChange}
                                color="primary"
                            />
                        }
                        label="Tâche terminée"
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Annuler</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TaskDialog;