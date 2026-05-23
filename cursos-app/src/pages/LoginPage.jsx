import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { request } from '../api/client';
import {
    Box, Button, TextField, Typography, Alert,
    CircularProgress, InputAdornment, IconButton
} from '@mui/material';
import { Person, Lock, Visibility, VisibilityOff, School } from '@mui/icons-material';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!username.trim() || !password.trim()) {
            setError('Completa todos los campos.');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const data = await request('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            login(data.token);
            navigate('/courses');
        } catch (e) {
            setError('Credenciales incorrectas. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            background: 'linear-gradient(135deg, #1a237e 0%, #1565C0 50%, #0288d1 100%)',
        }}>
            {/* Panel izquierdo decorativo */}
            <Box sx={{
                flex: 1,
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                px: 6, color: '#fff',
                width: '100%'

            }}>
                <School sx={{ fontSize: 72, mb: 3, opacity: 0.9 }} />
                <Typography variant="h3" fontWeight={800} mb={2} textAlign="center">
                    Plataforma de Cursos
                </Typography>
                <Typography variant="h6" fontWeight={300} textAlign="center" sx={{ opacity: 0.8, maxWidth: 380 }}>
                    Crea tus cursos desde un solo lugar
                </Typography>
            </Box>

            {/* Panel derecho — formulario */}
            <Box sx={{
                width: { xs: '100%', md: 480 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                px: { xs: 3, sm: 6 },
                background: '#fff',
                borderRadius: { md: '24px 0 0 24px' },
                boxShadow: '-8px 0 40px rgba(0,0,0,0.15)'
            }}>
                {/* Logo móvil */}
                <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 4, alignItems: 'center', gap: 1 }}>
                    <School sx={{ color: '#1565C0', fontSize: 32 }} />
                    <Typography variant="h6" fontWeight={700} color="#1a237e">
                        Plataforma de Cursos
                    </Typography>
                </Box>

                <Typography variant="h4" fontWeight={800} color="#1a1a2e" mb={1}>
                    Bienvenido
                </Typography>

                <Typography variant="body1" color="text.secondary" mt={2} mb={6}>
                    Ingresa tus credenciales para continuar
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Usuario"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ mt: 2, mb: 2.5 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Person sx={{ color: '#1565C0' }} />
                            </InputAdornment>
                        )
                    }}
                />

                <TextField
                    label="Contraseña"
                    type={showPass ? 'text' : 'password'}
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    sx={{ mb: 4 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock sx={{ color: '#1565C0' }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                                    {showPass ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                        py: 1.6,
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: '1rem',
                        background: 'linear-gradient(90deg, #1a237e, #1565C0)',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #0d1b6e, #0d47a1)',
                        }
                    }}
                >
                    {loading
                        ? <CircularProgress size={24} color="inherit" />
                        : 'Iniciar sesión'
                    }
                </Button>

                <Typography variant="caption" color="text.disabled" textAlign="center" mt={4}>
                    © 2026 Plataforma de Cursos — Icesi
                </Typography>
            </Box>
        </Box>
    );
}