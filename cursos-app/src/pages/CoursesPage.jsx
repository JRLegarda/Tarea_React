import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { request } from '../api/client';
import {
    Box, Button, TextField, Typography, Paper, Alert,
    CircularProgress, Chip, Grid, InputAdornment, Divider
} from '@mui/material';
import { Add, Logout, School, Tag, CreditScore, Description } from '@mui/icons-material';

export default function CoursesPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');
    const [credits, setCredits] = useState('');
    const [creating, setCreating] = useState(false);
    const [formError, setFormError] = useState(null);
    const [success, setSuccess] = useState(false);

    const fetchCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await request('/api/courses');
            setCourses(data);
        } catch (e) {
            setError('No se pudieron cargar los cursos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCourses(); }, []);

    const handleCreate = async () => {
        if (!name.trim()) { setFormError('El nombre es obligatorio.'); return; }
        if (!description.trim()) { setFormError('La descripción es obligatoria.'); return; }
        if (!code.trim()) { setFormError('El código es obligatorio.'); return; }
        if (!credits || parseInt(credits) <= 0) {
            setFormError('Los créditos deben ser un número positivo.');
            return;
        }
        setFormError(null);
        setCreating(true);
        try {
            await request('/api/courses', {
                method: 'POST',
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim(),
                    code: code.trim(),
                    credits: parseInt(credits),
                }),
            });
            setName(''); setDescription(''); setCode(''); setCredits('');
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            fetchCourses();
        } catch (e) {
            setFormError('Error al crear el curso. Verifica tus permisos.');
        } finally {
            setCreating(false);
        }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
            py: 4, px: 2
        }}>
            {/* Header */}
            <Box sx={{
                maxWidth: 900, mx: 'auto', mb: 4,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <School sx={{ fontSize: 32, color: '#1565C0' }} />
                    <Typography variant="h4" fontWeight={700} color="#1a1a2e">
                        Gestión de Cursos
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<Logout />}
                    onClick={handleLogout}
                    sx={{
                        borderColor: '#e53935', color: '#e53935',
                        '&:hover': { background: '#fdecea', borderColor: '#c62828' }
                    }}
                >
                    Cerrar sesión
                </Button>
            </Box>

            <Box sx={{ maxWidth: 900, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* Formulario */}
                <Paper elevation={0} sx={{
                    p: 4, borderRadius: 3,
                    border: '1px solid #e0e7ef',
                    background: '#fff'
                }}>
                    <Typography variant="h6" fontWeight={600} mb={3} color="#1a1a2e">
                        Nuevo curso
                    </Typography>

                    {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>Curso creado exitosamente.</Alert>}

                    <Grid container spacing={2} columns={12}>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField
                                label="Nombre del curso"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start"><School fontSize="small" /></InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField
                                label="Código"
                                fullWidth
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start"><Tag fontSize="small" /></InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 2 }}>
                            <TextField
                                label="Créditos"
                                type="number"
                                fullWidth
                                value={credits}
                                onChange={(e) => setCredits(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start"><CreditScore fontSize="small" /></InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                label="Descripción"
                                fullWidth
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start"><Description fontSize="small" /></InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            startIcon={creating ? <CircularProgress size={18} color="inherit" /> : <Add />}
                            onClick={handleCreate}
                            disabled={creating}
                            sx={{
                                px: 4, py: 1.2, borderRadius: 2,
                                background: 'linear-gradient(90deg, #1565C0, #1976D2)',
                                '&:hover': { background: 'linear-gradient(90deg, #0d47a1, #1565C0)' }
                            }}
                        >
                            {creating ? 'Creando...' : 'Crear curso'}
                        </Button>
                    </Box>
                </Paper>

                {/* Lista */}
                <Paper elevation={0} sx={{
                    borderRadius: 3,
                    border: '1px solid #e0e7ef',
                    background: '#fff',
                    overflow: 'hidden'
                }}>
                    <Box px={4} py={2.5} sx={{ borderBottom: '1px solid #e0e7ef' }}>
                        <Typography variant="h6" fontWeight={600} color="#1a1a2e">
                            Cursos registrados
                            <Chip label={courses.length} size="small"
                                sx={{ ml: 1.5, background: '#e3f2fd', color: '#1565C0', fontWeight: 700 }} />
                        </Typography>
                    </Box>

                    {loading && (
                        <Box display="flex" justifyContent="center" py={5}>
                            <CircularProgress />
                        </Box>
                    )}
                    {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}

                    {!loading && !error && courses.length === 0 && (
                        <Box textAlign="center" py={6}>
                            <School sx={{ fontSize: 48, color: '#bdbdbd', mb: 1 }} />
                            <Typography color="text.secondary">No hay cursos registrados aún.</Typography>
                        </Box>
                    )}

                    {!loading && !error && courses.map((c, i) => (
                        <Box key={c.id}>
                            <Box px={6} py={4.5} sx={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                '&:hover': { background: '#f5f7fa' }, transition: 'background 0.2s'
                            }}>
                                <Box>
                                    <Typography fontWeight={600} color="#1a1a2e">{c.name}</Typography>
                                    <Typography variant="body2" color="text.secondary" mt={0.3}>
                                        {c.description}
                                    </Typography>
                                </Box>
                                <Box display="flex" gap={1} ml={2}>
                                    <Chip label={c.code} size="small"
                                        sx={{ background: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }} />
                                    <Chip label={`${c.credits} créditos`} size="small"
                                        sx={{ background: '#e3f2fd', color: '#1565C0', fontWeight: 600 }} />
                                </Box>
                            </Box>
                            {i < courses.length - 1 && <Divider />}
                        </Box>
                    ))}
                </Paper>
            </Box>
        </Box>
    );
}