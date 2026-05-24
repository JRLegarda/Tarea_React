import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { request } from '../api/client';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      login(data);
      navigate('/courses');
    } catch (err) {
      setError('Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />

      <div className="login-panel">
        <div className="login-badge">🎓</div>
        <h1 className="login-title">Bienvenido<br />de nuevo</h1>
        <p className="login-sub">Ingresa tus credenciales para continuar</p>

        {error && <div className="login-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field-wrap">
            <label className="field-label">Usuario</label>
            <input
              className="field-input"
              placeholder="ej. admin"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="field-wrap">
            <label className="field-label">Contraseña</label>
            <input
              className="field-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar →'}
          </button>
        </form>

        <p className="login-hint">
          Usuarios de prueba<br />
          <span>admin / admin123</span> · <span>profesor / prof123</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;