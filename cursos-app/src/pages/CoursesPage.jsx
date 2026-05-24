import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { request } from '../api/client';

const COLORS = [
  'card-pink', 'card-purple', 'card-blue', 'card-teal', 'card-orange', 'card-green'
];

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

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.code || !formData.credits) {
      setFormError('Todos los campos son obligatorios.'); return;
    }
    setSaving(true); setFormError('');
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        code: formData.code.trim(),
        credits: Number(formData.credits),
      };
      await request('/api/courses', { method: 'POST', body: JSON.stringify(payload) });
      setOpen(false);
      setFormData({ name: '', description: '', code: '', credits: '' });
      fetchCourses();
    } catch {
      setFormError('Error al crear el curso. Verifica los datos o tus permisos.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #0a0a10; }

        .cp-root {
          min-height: 100vh;
          background: #0a0a10;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
        }

        /* ── NAVBAR ── */
        .cp-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 40px;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          position: sticky; top: 0; z-index: 50;
        }

        .cp-nav-logo {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(90deg, #ff3cac, #ffcc00, #2b86c5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cp-nav-right { display: flex; align-items: center; gap: 16px; }

        .cp-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff3cac, #784ba0);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700;
          box-shadow: 0 0 0 2px rgba(255,60,172,0.4);
        }

        .cp-username { font-size: 14px; color: rgba(255,255,255,0.7); }

        .cp-logout-btn {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: rgba(255,255,255,0.6);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          padding: 7px 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .cp-logout-btn:hover {
          background: rgba(255,80,80,0.15);
          border-color: rgba(255,80,80,0.3);
          color: #ff8080;
        }

        /* ── HERO HEADER ── */
        .cp-hero {
          padding: 56px 40px 40px;
          position: relative;
          overflow: hidden;
        }

        .cp-hero-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 10% 50%, rgba(255,60,172,0.12) 0%, transparent 70%),
                      radial-gradient(ellipse 40% 60% at 90% 20%, rgba(43,134,197,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .cp-hero-inner {
          position: relative;
          display: flex; align-items: flex-end; justify-content: space-between;
          flex-wrap: wrap; gap: 20px;
        }

        .cp-hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800;
          line-height: 1.05;
        }

        .cp-hero-title em {
          font-style: normal;
          background: linear-gradient(90deg, #ff3cac, #ffcc00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cp-hero-count {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          margin-top: 8px;
        }

        .cp-add-btn {
          padding: 14px 28px;
          background: linear-gradient(135deg, #ff3cac, #784ba0);
          border: none;
          border-radius: 14px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 8px 28px rgba(255,60,172,0.35);
          white-space: nowrap;
        }
        .cp-add-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(255,60,172,0.5); }

        /* ── CONTENT ── */
        .cp-content { padding: 0 40px 60px; }

        /* states */
        .cp-spinner-wrap {
          display: flex; flex-direction: column; align-items: center;
          gap: 16px; padding: 80px 0; color: rgba(255,255,255,0.3);
          font-size: 14px;
        }
        .cp-spinner {
          width: 36px; height: 36px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: #ff3cac;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .cp-alert {
          padding: 14px 18px; border-radius: 12px; font-size: 14px;
          background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.25); color: #ff8080;
        }
        .cp-alert-info {
          background: rgba(255,204,0,0.08); border: 1px solid rgba(255,204,0,0.2); color: rgba(255,204,0,0.8);
        }

        /* ── GRID ── */
        .cp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 8px;
        }

        .cp-card {
          border-radius: 20px;
          padding: 26px;
          position: relative;
          overflow: hidden;
          cursor: default;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: cardIn 0.4s cubic-bezier(.22,1,.36,1) both;
        }
        .cp-card:hover { transform: translateY(-4px); }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .card-pink   { background: linear-gradient(135deg, #ff3cac22, #ff3cac08); border: 1px solid #ff3cac40; }
        .card-purple { background: linear-gradient(135deg, #784ba022, #784ba008); border: 1px solid #784ba040; }
        .card-blue   { background: linear-gradient(135deg, #2b86c522, #2b86c508); border: 1px solid #2b86c540; }
        .card-teal   { background: linear-gradient(135deg, #00c9b122, #00c9b108); border: 1px solid #00c9b140; }
        .card-orange { background: linear-gradient(135deg, #ff7b0022, #ff7b0008); border: 1px solid #ff7b0040; }
        .card-green  { background: linear-gradient(135deg, #39d35322, #39d35308); border: 1px solid #39d35340; }

        .card-pink   .cp-card-dot { background: #ff3cac; box-shadow: 0 0 12px #ff3cac; }
        .card-purple .cp-card-dot { background: #a97be8; box-shadow: 0 0 12px #a97be8; }
        .card-blue   .cp-card-dot { background: #2b86c5; box-shadow: 0 0 12px #2b86c5; }
        .card-teal   .cp-card-dot { background: #00c9b1; box-shadow: 0 0 12px #00c9b1; }
        .card-orange .cp-card-dot { background: #ff7b00; box-shadow: 0 0 12px #ff7b00; }
        .card-green  .cp-card-dot { background: #39d353; box-shadow: 0 0 12px #39d353; }

        .cp-card-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 12px; margin-bottom: 16px;
        }

        .cp-card-code {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.6);
        }

        .cp-card-credits {
          display: flex; align-items: center; gap: 5px;
          font-size: 12px; color: rgba(255,255,255,0.45);
        }

        .cp-card-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 2px; }

        .cp-card-name {
          font-family: 'Syne', sans-serif;
          font-size: 19px;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 10px;
        }

        .cp-card-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
        }

        .cp-card-teacher {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.07);
          font-size: 12px;
          color: rgba(255,255,255,0.35);
        }

        /* ── MODAL ── */
        .cp-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .cp-modal {
          width: 100%; max-width: 480px;
          background: #16161f;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 36px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6);
          animation: modalIn 0.3s cubic-bezier(.22,1,.36,1);
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.93) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .cp-modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 24px; font-weight: 800;
          margin-bottom: 6px;
        }
        .cp-modal-sub { font-size: 13px; color: rgba(255,255,255,0.35); margin-bottom: 28px; }

        .cp-modal-error {
          background: rgba(255,80,80,0.1);
          border: 1px solid rgba(255,80,80,0.3);
          color: #ff8080;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          margin-bottom: 18px;
        }

        .m-field { margin-bottom: 16px; }
        .m-label {
          display: block; font-size: 11px; font-weight: 500;
          color: rgba(255,255,255,0.4); text-transform: uppercase;
          letter-spacing: 0.08em; margin-bottom: 7px;
        }
        .m-input, .m-textarea {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 11px;
          padding: 12px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .m-input::placeholder, .m-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .m-input:focus, .m-textarea:focus {
          border-color: #ff3cac;
          box-shadow: 0 0 0 3px rgba(255,60,172,0.12);
        }
        .m-textarea { resize: vertical; min-height: 80px; }

        .m-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .cp-modal-actions { display: flex; gap: 12px; margin-top: 24px; }

        .m-cancel {
          flex: 1; padding: 13px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .m-cancel:hover { background: rgba(255,255,255,0.09); color: #fff; }

        .m-save {
          flex: 2; padding: 13px;
          background: linear-gradient(135deg, #ff3cac, #784ba0);
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700;
          color: #fff; cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 6px 20px rgba(255,60,172,0.3);
        }
        .m-save:disabled { opacity: 0.5; cursor: not-allowed; }
        .m-save:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(255,60,172,0.45); }
      `}</style>

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
                {loading ? 'Cargando...' : `${courses.length} curso${courses.length !== 1 ? 's' : ''} registrado${courses.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <button className="cp-add-btn" onClick={() => { setFormData({ name: '', description: '', code: '', credits: '' }); setFormError(''); setOpen(true); }}>
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

          {!loading && error && <div className="cp-alert">⚠️ {error}</div>}

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
      </div>

      {/* Modal */}
      {open && (
        <div className="cp-overlay" onClick={e => e.target === e.currentTarget && setOpen(false)}>
          <div className="cp-modal">
            <h2 className="cp-modal-title">Nuevo curso</h2>
            <p className="cp-modal-sub">Completa la información del curso</p>

            {formError && <div className="cp-modal-error">⚠️ {formError}</div>}

            <div className="m-field">
              <label className="m-label">Nombre del curso</label>
              <input className="m-input" placeholder="ej. Programación Orientada a Objetos"
                value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="m-field">
              <label className="m-label">Descripción</label>
              <textarea className="m-textarea" placeholder="Descripción breve del curso..."
                value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="m-row">
              <div className="m-field">
                <label className="m-label">Código</label>
                <input className="m-input" placeholder="ej. ISIS1225"
                  value={formData.code} onChange={e => setFormData(p => ({ ...p, code: e.target.value }))} />
              </div>
              <div className="m-field">
                <label className="m-label">Créditos</label>
                <input className="m-input" type="number" placeholder="ej. 3" min="1"
                  value={formData.credits} onChange={e => setFormData(p => ({ ...p, credits: e.target.value }))} />
              </div>
            </div>

            <div className="cp-modal-actions">
              <button className="m-cancel" onClick={() => setOpen(false)} disabled={saving}>Cancelar</button>
              <button className="m-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar curso ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CoursesPage;