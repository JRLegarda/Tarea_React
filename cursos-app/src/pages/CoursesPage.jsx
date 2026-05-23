import { useState, useEffect } from 'react';
import {
  Container, Typography, List, ListItem, ListItemText,
  Divider, Button, Box, Chip, CircularProgress
} from '@mui/material';
import { request } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import CourseForm from '../components/CourseForm';

export default function CoursesPage() {
  const [courses, setCourses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { logout, username }    = useAuth();

  const loadCourses = () => {
    setLoading(true);
    request('/api/courses')
      .then(setCourses)
      .catch(err => {
        if (err.message.includes('403') || err.message.includes('401')) logout();
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCourses(); }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Cursos — {username}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={() => setShowForm(v => !v)}>
            {showForm ? 'Cancelar' : '+ Agregar curso'}
          </Button>
          <Button variant="outlined" onClick={logout}>Cerrar sesión</Button>
        </Box>
      </Box>

      {showForm && (
        <CourseForm onSuccess={() => { setShowForm(false); loadCourses(); }} />
      )}

      {loading ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : (
        <List>
          {courses.map(course => (
            <Box key={course.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight={500}>{course.name}</Typography>
                      <Chip label={course.code} size="small" />
                      <Chip label={`${course.credits} créditos`} size="small" color="primary" />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">{course.description}</Typography>
                      <Typography variant="body2">
                        Docente: {course.teacher?.name ?? 'Sin asignar'}
                      </Typography>
                      {course.students?.length > 0 && (
                        <Typography variant="body2">
                          Estudiantes: {course.students.join(', ')}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </Box>
          ))}
          {courses.length === 0 && (
            <Typography color="text.secondary" sx={{ mt: 2 }}>No hay cursos registrados.</Typography>
          )}
        </List>
      )}
    </Container>
  );
}