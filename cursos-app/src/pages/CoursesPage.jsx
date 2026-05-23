import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { request } from '../api/client'
import { useAuth } from '../auth/AuthContext'

const initialCourseForm = {
  name: '',
  description: '',
}

export function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(initialCourseForm)
  const [saving, setSaving] = useState(false)

  const { logout } = useAuth()

  const loadCourses = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await request('/api/courses')
      setCourses(Array.isArray(data) ? data : [])
    } catch (loadError) {
      setError(loadError.message || 'No fue posible cargar los cursos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const handleCreateCourse = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      await request('/api/courses', {
        method: 'POST',
        body: JSON.stringify(form),
      })

      setOpen(false)
      setForm(initialCourseForm)
      await loadCourses()
    } catch (saveError) {
      setError(saveError.message || 'No fue posible crear el curso')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box className="page page-courses">
      <Container maxWidth="md">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4">Cursos</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={loadCourses} disabled={loading}>
              Recargar
            </Button>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Nuevo curso
            </Button>
            <Button color="error" onClick={logout}>
              Cerrar sesion
            </Button>
          </Stack>
        </Stack>

        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

        <Card>
          <CardContent>
            {loading ? (
              <Stack alignItems="center" py={4}>
                <CircularProgress />
              </Stack>
            ) : courses.length === 0 ? (
              <Typography color="text.secondary">No hay cursos registrados.</Typography>
            ) : (
              <List>
                {courses.map((course, index) => (
                  <ListItem key={course.id ?? `${course.name}-${index}`} divider>
                    <ListItemText
                      primary={course.name ?? 'Curso sin nombre'}
                      secondary={course.description ?? 'Sin descripcion'}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Container>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Crear curso</DialogTitle>
        <Stack component="form" onSubmit={handleCreateCourse}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Nombre"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
                fullWidth
              />
              <TextField
                label="Descripcion"
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                required
                fullWidth
                multiline
                minRows={3}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} disabled={saving}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogActions>
        </Stack>
      </Dialog>
    </Box>
  )
}