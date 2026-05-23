import { useState } from 'react'
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const destination = location.state?.from?.pathname || '/courses'

  if (isAuthenticated) {
    return <Navigate to={destination} replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await login(username.trim(), password)
      navigate(destination, { replace: true })
    } catch (submitError) {
      setError(submitError.message || 'No fue posible iniciar sesion')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box className="page page-login">
      <Card className="form-card">
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Iniciar sesion
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ingresa para ver y crear cursos.
          </Typography>

          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <TextField
              label="Usuario"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
              fullWidth
            />
            <TextField
              label="Contrasena"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              fullWidth
            />
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Ingresando...' : 'Entrar'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}