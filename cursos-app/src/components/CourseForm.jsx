import { useState } from 'react';
import { TextField, Button, Box, Paper, Typography, Alert } from '@mui/material';
import { request } from '../api/client';
import { useAuth } from '../auth/AuthContext';

export default function CourseForm({ onSuccess }) {
  const { userId } = useAuth();
  const [form, setForm] = useState({
    name: '', description: '', code: '', credits: '', teacherId: userId
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.name || !form.description || !form.code || !form.credits) {
      setError('Todos los campos son requeridos');
      return;
    }
    setLoading(true);
    try {
      await request('/api/courses', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          credits:   parseInt(form.credits, 10),
          teacherId: userId ? Number(userId) : null,
        }),
      });
      onSuccess();
    } catch (err) {
      setError(err.message.includes('403')
        ? 'No tienes permiso para crear cursos (necesitas rol ADMIN)'
        : 'Error al crear el curso: ' + err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Nuevo curso</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Nombre del curso"    value={form.name}        onChange={handleChange('name')}        required />
        <TextField label="Descripción"         value={form.description} onChange={handleChange('description')} required multiline rows={2} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField label="Código (ej: SO101)" value={form.code}    onChange={handleChange('code')}    required sx={{ flex: 1 }} />
          <TextField label="Créditos"           value={form.credits} onChange={handleChange('credits')} required type="number"
            inputProps={{ min: 1 }} sx={{ width: 120 }} />
        </Box>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Guardando...' : 'Crear curso'}
        </Button>
      </Box>
    </Paper>
  );
}