import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { request } from '../api/client';
import '../styles/CoursesPage.css';

const COLORS = ['card-pink', 'card-purple', 'card-blue', 'card-teal', 'card-orange', 'card-green'];

const CoursesPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', code: '', credits: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await request('/api/courses');
      setCourses(data);
    } catch {
      setError('No se pudieron cargar los cursos. Verifica que el backend esté activo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleOpenModal = () => {
    setFormData({ name: '', description: '', code: '', credits: '' });
    setFormError('');
    setOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.code || !formData.credits) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        code: formData.code.trim(),
        credits: Number(formData.credits),
      };
      await request('/api/courses', { method: 'POST', body: JSON.stringify(payload) });
      setOpen(false);
      fetchCourses();
    } catch (e) {
      setFormError(e.message || 'Error al crear el curso.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field) => (e) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="cp-root">
      {/* Navbar */}
      <nav className="cp-nav">
        <span className="cp-nav-logo">🎓 CursosApp</span>
        <div className="cp-nav-right">
          <div className="cp-avatar">{user?.username?.[0]?.toUpperCase()}</div>
          <span className="cp-username">{user?.username}</span>
          <button className="cp-logout-btn" onClick={handleLogout}>Salir →</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="cp-hero">
        <div className="cp-hero-bg" />
        <div className="cp-hero-inner">
          <div>
            <h1 className="cp-hero-title">
              Gestión de<br /><em>Cursos</em>
            </h1>
            <p className="cp-hero-count">
              {loading
                ? 'Cargando...'
                : `${courses.length} curso${courses.length !== 1 ? 's' : ''} registrado${courses.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button className="cp-add-btn" onClick={handleOpenModal}>
            + Agregar curso
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="cp-content">
        {loading && (
          <div className="cp-spinner-wrap">
            <div className="cp-spinner" />
            Cargando cursos...
          </div>
        )}

        {!loading && error && (
          <div className="cp-alert">⚠️ {error}</div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="cp-alert cp-alert-info">✨ No hay cursos aún — ¡agrega el primero!</div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="cp-grid">
            {courses.map((course, i) => (
              <div
                key={course.id}
                className={`cp-card ${COLORS[i % COLORS.length]}`}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="cp-card-top">
                  <span className="cp-card-code">{course.code}</span>
                  <span className="cp-card-credits">
                    <div className="cp-card-dot" />
                    {course.credits} créditos
                  </span>
                </div>
                <h3 className="cp-card-name">{course.name}</h3>
                <p className="cp-card-desc">{course.description}</p>
                {course.teacher && (
                  <p className="cp-card-teacher">
                    👤 {course.teacher.firstName} {course.teacher.lastName}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div
          className="cp-overlay"
          onClick={e => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="cp-modal">
            <h2 className="cp-modal-title">Nuevo curso</h2>
            <p className="cp-modal-sub">Completa la información del curso</p>

            {formError && <div className="cp-modal-error">⚠️ {formError}</div>}

            <div className="m-field">
              <label className="m-label">Nombre del curso</label>
              <input
                className="m-input"
                placeholder="ej. Programación Orientada a Objetos"
                value={formData.name}
                onChange={handleChange('name')}
              />
            </div>
            <div className="m-field">
              <label className="m-label">Descripción</label>
              <textarea
                className="m-textarea"
                placeholder="Descripción breve del curso..."
                value={formData.description}
                onChange={handleChange('description')}
              />
            </div>
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Código</label>
                <input
                  className="m-input"
                  placeholder="ej. ISIS1225"
                  value={formData.code}
                  onChange={handleChange('code')}
                />
              </div>
              <div className="m-field">
                <label className="m-label">Créditos</label>
                <input
                  className="m-input"
                  type="number"
                  placeholder="ej. 3"
                  min="1"
                  value={formData.credits}
                  onChange={handleChange('credits')}
                />
              </div>
            </div>

            <div className="cp-modal-actions">
              <button className="m-cancel" onClick={() => setOpen(false)} disabled={saving}>
                Cancelar
              </button>
              <button className="m-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar curso ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;