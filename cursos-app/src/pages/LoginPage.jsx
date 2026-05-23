import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Container, Typography } from '@mui/material';
import { request } from '../api/client';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  
    const handleSubmit = async () => {
    try {
        const data = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        });
        login({ token: data.token, id: data.id, username: data.username });
        navigate('/cursos');
    } catch (err) {
        setError('Usuario o contraseña incorrectos');
    }
    };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5">Iniciar sesión</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField label="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
        <TextField label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button variant="contained" onClick={handleSubmit}>Entrar</Button>
      </Box>
    </Container>
  );
}