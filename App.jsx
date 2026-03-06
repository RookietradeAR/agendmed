import { useState } from "react";

// ─── Paleta ────────────────────────────────────────────────────
const C = {
  primary:    "#0B6E72",   // teal profundo
  primary100: "#E6F4F4",
  primary200: "#B3DDE0",
  primary300: "#5BADB2",
  accent:     "#2BA8A4",
  accentLight:"#E8F7F7",
  sky:        "#EFF8FA",
  warn:       "#C8720A",
  warnBg:     "#FEF3E2",
  danger:     "#C0392B",
  dangerBg:   "#FDECEA",
  success:    "#1A7A4A",
  successBg:  "#E6F4ED",
  info:       "#1B5FA8",
  infoBg:     "#E8F0FB",
  neutral:    "#5E6E7A",
  neutralBg:  "#F1F4F6",
  border:     "#DDE4E8",
  bg:         "#F5F8FA",
  white:      "#FFFFFF",
  text:       "#1A2730",
  textSoft:   "#4A5B65",
  textMuted:  "#8A9BA5",
};

// ─── Datos realistas ────────────────────────────────────────────
const MOTIVOS = ["Enfermedad", "Licencia programada", "Capacitación / Congreso", "Guardia institucional", "Causa personal", "Fuerza mayor", "Otro"];
const TIPOS   = ["Ausencia total", "Ausencia parcial", "Llegada tardía", "Salida anticipada", "Recuperación"];
const SEDES   = ["Sede Palermo", "Sede Belgrano", "Sede Caballito"];

const novedadesInit = [
  {
    id: 1,
    profesional: "Dra. Valeria Suárez",
    iniciales: "VS",
    especialidad: "Pediatría",
    sede: "Sede Palermo",
    tipo: "Ausencia total",
    fecha: "12/03/2025",
    motivo: "Enfermedad",
    estado: "Pendiente",
    antelacion: "36 hs",
    etiqueta: "Aviso normal",
    obs: "Presentó certificado médico.",
    fechaCarga: "11/03/2025 · 08:22",
  },
  {
    id: 2,
    profesional: "Dr. Martín Ríos",
    iniciales: "MR",
    especialidad: "Cardiología",
    sede: "Sede Belgrano",
    tipo: "Llegada tardía",
    fecha: "12/03/2025",
    motivo: "Causa personal",
    estado: "Pendiente",
    antelacion: "5 hs",
    etiqueta: "Aviso tardío",
    obs: "Llega a las 10:00 en lugar de las 08:00.",
    fechaCarga: "12/03/2025 · 04:55",
  },
  {
    id: 3,
    profesional: "Dra. Claudia Herrera",
    iniciales: "CH",
    especialidad: "Ginecología",
    sede: "Sede Caballito",
    tipo: "Recuperación",
    fecha: "10/03/2025",
    motivo: "Licencia programada",
    estado: "Confirmada",
    antelacion: "110 hs",
    etiqueta: "Con anticipación",
    obs: "Propone recuperar el viernes 14/03 de 14:00 a 18:00.",
    fechaCarga: "05/03/2025 · 17:10",
  },
  {
    id: 4,
    profesional: "Dr. Sebastián Morales",
    iniciales: "SM",
    especialidad: "Traumatología",
    sede: "Sede Palermo",
    tipo: "Ausencia parcial",
    fecha: "13/03/2025",
    motivo: "Capacitación / Congreso",
    estado: "En aclaración",
    antelacion: "20 hs",
    etiqueta: "Aviso tardío",
    obs: "Solo disponible por la tarde, de 14:00 a 18:00.",
    fechaCarga: "12/03/2025 · 17:45",
  },
  {
    id: 5,
    profesional: "Dra. Natalia Quiroga",
    iniciales: "NQ",
    especialidad: "Clínica Médica",
    sede: "Sede Belgrano",
    tipo: "Ausencia total",
    fecha: "14/03/2025",
    motivo: "Guardia institucional",
    estado: "Cerrada con recuperación",
    antelacion: "72 hs",
    etiqueta: "Con anticipación",
    obs: "",
    fechaCarga: "11/03/2025 · 09:00",
  },
];

const etiquetaMeta = {
  "Con anticipación": { color: C.success,  bg: C.successBg, dot: "●" },
  "Aviso normal":     { color: C.info,     bg: C.infoBg,    dot: "●" },
  "Aviso tardío":     { color: C.warn,     bg: C.warnBg,    dot: "●" },
  "Aviso de último momento": { color: C.danger, bg: C.dangerBg, dot: "●" },
};
const estadoMeta = {
  "Pendiente":                { color: C.warn,    bg: C.warnBg    },
  "Confirmada":               { color: C.success, bg: C.successBg },
  "En aclaración":            { color: C.info,    bg: C.infoBg    },
  "Cerrada con recuperación": { color: C.success, bg: C.successBg },
  "Cerrada sin recuperación": { color: C.neutral, bg: C.neutralBg },
};

// ─── Helpers ─────────────────────────────────────────────────
function Badge({ text, color, bg, size = 12 }) {
  return (
    <span style={{
      fontSize: size, fontWeight: 600, color,
      background: bg, padding: "3px 10px",
      borderRadius: 20, whiteSpace: "nowrap",
      letterSpacing: 0.2,
    }}>{text}</span>
  );
}

function Avatar({ initials, size = 36, color = C.primary }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color + "18", border: `1.5px solid ${color}40`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.33, fontWeight: 700, color, flexShrink: 0,
      fontFamily: "Lato, sans-serif",
    }}>{initials}</div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: C.border, margin: "20px 0" }} />;
}

function Label({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
      {children}
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 8,
          border: `1.5px solid ${C.border}`, fontSize: 13, color: C.text,
          background: C.white, boxSizing: "border-box", outline: "none",
          fontFamily: "Lato, sans-serif",
        }}
        onFocus={e => e.target.style.borderColor = C.primary}
        onBlur={e => e.target.style.borderColor = C.border}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 8,
          border: `1.5px solid ${C.border}`, fontSize: 13, color: value ? C.text : C.textMuted,
          background: C.white, boxSizing: "border-box", fontFamily: "Lato, sans-serif",
        }}>
        <option value="">Seleccioná</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Chip({ label, active, onClick, activeColor = C.primary }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
      fontWeight: active ? 700 : 500, fontFamily: "Lato, sans-serif",
      background: active ? activeColor : C.white,
      color: active ? C.white : C.textSoft,
      border: active ? `1.5px solid ${activeColor}` : `1.5px solid ${C.border}`,
      transition: "all 0.15s",
    }}>{label}</button>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.white, borderRadius: 14,
      border: `1px solid ${C.border}`,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      ...style,
    }}>{children}</div>
  );
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <Card style={{ padding: "22px 24px", flex: 1, minWidth: 140 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 30, fontWeight: 800, color: color || C.text, fontFamily: "Lora, Georgia, serif", lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 13, color: C.text, fontWeight: 600, marginTop: 6 }}>{label}</div>
          {sub && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>{sub}</div>}
        </div>
        <div style={{ fontSize: 22, opacity: 0.5 }}>{icon}</div>
      </div>
    </Card>
  );
}

function BarRow({ label, value, max, color }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: C.textSoft }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{value}</span>
      </div>
      <div style={{ height: 5, background: C.neutralBg, borderRadius: 4 }}>
        <div style={{ height: 5, width: `${(value / max) * 100}%`, background: color, borderRadius: 4, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────
function Logo({ size = "md" }) {
  const big = size === "lg";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: big ? 12 : 8 }}>
      <div style={{
        width: big ? 42 : 30, height: big ? 42 : 30, borderRadius: big ? 12 : 8,
        background: `linear-gradient(135deg, ${C.primary} 0%, ${C.accent} 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 2px 8px ${C.primary}40`, flexShrink: 0,
      }}>
        <svg width={big ? 22 : 16} height={big ? 22 : 16} viewBox="0 0 24 24" fill="none">
          <rect x="10" y="3" width="4" height="18" rx="2" fill="white" />
          <rect x="3" y="10" width="18" height="4" rx="2" fill="white" opacity="0.85" />
        </svg>
      </div>
      <div>
        <div style={{
          fontSize: big ? 20 : 15, fontWeight: 800, color: C.primary,
          fontFamily: "Lora, Georgia, serif", letterSpacing: -0.3, lineHeight: 1,
        }}>AgendaMed</div>
        {big && <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>Gestión de agendas</div>}
      </div>
    </div>
  );
}

// ─── Vista Profesional ────────────────────────────────────────
function ViewNuevaNovedad({ onSubmit }) {
  const [form, setForm] = useState({ tipo: "", fecha: "", sede: "", motivo: "", horaDesde: "", horaHasta: "", fechaRecup: "", obs: "" });
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const showHorario = ["Ausencia parcial", "Llegada tardía", "Salida anticipada"].includes(form.tipo);
  const showRecup   = form.tipo === "Recuperación";
  const canSubmit   = form.tipo && form.fecha && form.sede && form.motivo;

  if (submitted) return (
    <div style={{ maxWidth: 480, margin: "80px auto", textAlign: "center", padding: 32 }}>
      <div style={{
        width: 72, height: 72, borderRadius: "50%", background: C.successBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px", fontSize: 32,
      }}>✓</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: "Lora, Georgia, serif" }}>Aviso enviado correctamente</div>
      <div style={{ fontSize: 14, color: C.textSoft, marginTop: 10, lineHeight: 1.6 }}>
        El centro recibió tu novedad. Te notificaremos cuando haya una respuesta.
      </div>
      <button onClick={() => { setSubmitted(false); setForm({ tipo: "", fecha: "", sede: "", motivo: "", horaDesde: "", horaHasta: "", fechaRecup: "", obs: "" }); }}
        style={{ marginTop: 28, background: C.primary, color: C.white, border: "none", borderRadius: 10, padding: "12px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Lato, sans-serif" }}>
        Cargar otra novedad
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 580, margin: "0 auto", padding: "36px 0" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: "Lora, Georgia, serif", margin: 0 }}>Nueva novedad de agenda</h2>
        <p style={{ fontSize: 13, color: C.textSoft, marginTop: 6, marginBottom: 0 }}>
          El centro recibirá el aviso de forma inmediata al enviarlo.
        </p>
      </div>

      <Card style={{ padding: 32 }}>
        {/* Tipo */}
        <Label>Tipo de novedad *</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {TIPOS.map(t => <Chip key={t} label={t} active={form.tipo === t} onClick={() => set("tipo", t)} />)}
        </div>

        {/* Fecha + Sede */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <Label>Fecha afectada *</Label>
            <input type="date" value={form.fecha} onChange={e => set("fecha", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.text, background: C.white, boxSizing: "border-box", fontFamily: "Lato, sans-serif" }} />
          </div>
          <div style={{ flex: 1 }}>
            <Select label="Sede *" value={form.sede} onChange={v => set("sede", v)} options={SEDES} />
          </div>
        </div>

        {/* Horarios */}
        {showHorario && (
          <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <Label>Desde</Label>
              <input type="time" value={form.horaDesde} onChange={e => set("horaDesde", e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.text, background: C.white, boxSizing: "border-box", fontFamily: "Lato, sans-serif" }} />
            </div>
            <div style={{ flex: 1 }}>
              <Label>Hasta</Label>
              <input type="time" value={form.horaHasta} onChange={e => set("horaHasta", e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.text, background: C.white, boxSizing: "border-box", fontFamily: "Lato, sans-serif" }} />
            </div>
          </div>
        )}

        {/* Fecha recuperación */}
        {showRecup && (
          <div style={{ marginBottom: 24 }}>
            <Label>Fecha propuesta de recuperación</Label>
            <input type="date" value={form.fechaRecup} onChange={e => set("fechaRecup", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.text, background: C.white, boxSizing: "border-box", fontFamily: "Lato, sans-serif" }} />
          </div>
        )}

        {/* Motivo */}
        <Label>Motivo *</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {MOTIVOS.map(m => <Chip key={m} label={m} active={form.motivo === m} onClick={() => set("motivo", m)} activeColor={C.info} />)}
        </div>

        {/* Obs */}
        <div style={{ marginBottom: 28 }}>
          <Label>Observaciones <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(opcional)</span></Label>
          <textarea value={form.obs} onChange={e => set("obs", e.target.value)} rows={3} placeholder="Cualquier detalle adicional para el centro..."
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.text, background: C.white, boxSizing: "border-box", resize: "vertical", fontFamily: "Lato, sans-serif" }} />
        </div>

        <button onClick={() => canSubmit && (onSubmit(form), setSubmitted(true))} style={{
          width: "100%", background: canSubmit ? `linear-gradient(135deg, ${C.primary} 0%, ${C.accent} 100%)` : C.neutralBg,
          color: canSubmit ? C.white : C.textMuted, border: "none", borderRadius: 10,
          padding: "13px", fontSize: 14, fontWeight: 700, cursor: canSubmit ? "pointer" : "default",
          fontFamily: "Lato, sans-serif", transition: "all 0.2s",
          boxShadow: canSubmit ? `0 4px 12px ${C.primary}30` : "none",
        }}>
          Enviar aviso al centro
        </button>
      </Card>
    </div>
  );
}

// ─── Mis avisos (profesional) ─────────────────────────────────
function ViewMisAvisos({ novedades }) {
  return (
    <div style={{ padding: "36px 0" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: "Lora, Georgia, serif", margin: "0 0 6px" }}>Mis avisos</h2>
      <p style={{ fontSize: 13, color: C.textSoft, margin: "0 0 28px" }}>Historial de novedades que enviaste al centro.</p>

      {novedades.length === 0 && (
        <Card style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 14, color: C.textMuted }}>No tenés novedades enviadas aún.</div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {novedades.map(n => {
          const em = etiquetaMeta[n.etiqueta] || {};
          const sm = estadoMeta[n.estado] || {};
          return (
            <Card key={n.id} style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{n.tipo}</div>
                  <div style={{ fontSize: 12, color: C.textSoft, marginTop: 3 }}>{n.fecha} · {n.sede}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Badge text={`${em.dot} ${n.etiqueta}`} color={em.color} bg={em.bg} />
                  <Badge text={n.estado} color={sm.color} bg={sm.bg} />
                </div>
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 20, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, color: C.textSoft }}>💬 {n.motivo}</span>
                {n.obs && <span style={{ fontSize: 12, color: C.textMuted, fontStyle: "italic" }}>"{n.obs}"</span>}
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 8 }}>Enviado el {n.fechaCarga}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Vista Centro ─────────────────────────────────────────────
function ViewCentro({ novedades, onAction }) {
  const [selected, setSelected] = useState(null);
  const [accion, setAccion] = useState("");
  const [comentario, setComentario] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const pendientes = novedades.filter(n => n.estado === "Pendiente");
  const estados = ["Todos", "Pendiente", "Confirmada", "En aclaración", "Cerrada con recuperación", "Cerrada sin recuperación"];
  const filtradas = filtroEstado === "Todos" ? novedades : novedades.filter(n => n.estado === filtroEstado);

  const acciones = selected?.tipo === "Recuperación"
    ? ["Confirmar recuperación", "Proponer nueva fecha", "Rechazar recuperación"]
    : ["Confirmar", "Pedir aclaración"];

  const comentarioObligatorio = ["Pedir aclaración", "Rechazar recuperación", "Proponer nueva fecha"].includes(accion);

  const handleAccion = () => {
    if (!accion) return;
    if (comentarioObligatorio && !comentario.trim()) return;
    onAction(selected.id, accion);
    setSelected(null);
    setAccion("");
    setComentario("");
  };

  return (
    <div style={{ padding: "36px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: "Lora, Georgia, serif", margin: "0 0 4px" }}>Novedades de agenda</h2>
          <p style={{ fontSize: 13, color: C.textSoft, margin: 0 }}>Revisá y gestioná los avisos de los profesionales.</p>
        </div>
        {pendientes.length > 0 && (
          <div style={{ background: C.warnBg, border: `1px solid ${C.warn}30`, borderRadius: 10, padding: "10px 18px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.warn }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.warn }}>{pendientes.length} pendiente{pendientes.length > 1 ? "s" : ""} sin resolver</span>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {estados.map(e => (
          <Chip key={e} label={e} active={filtroEstado === e} onClick={() => setFiltroEstado(e)} />
        ))}
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        {/* Lista */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {filtradas.map(n => {
            const em = etiquetaMeta[n.etiqueta] || {};
            const sm = estadoMeta[n.estado] || {};
            const isSelected = selected?.id === n.id;
            return (
              <Card key={n.id} style={{
                padding: "16px 20px", cursor: "pointer",
                border: isSelected ? `1.5px solid ${C.primary}` : `1px solid ${C.border}`,
                boxShadow: isSelected ? `0 0 0 3px ${C.primary}12` : "0 1px 4px rgba(0,0,0,0.05)",
                transition: "all 0.15s",
              }} onClick={() => { setSelected(isSelected ? null : n); setAccion(""); setComentario(""); }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <Avatar initials={n.iniciales} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{n.profesional}</span>
                        <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 8 }}>{n.especialidad}</span>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Badge text={`${em.dot} ${n.etiqueta}`} color={em.color} bg={em.bg} />
                        <Badge text={n.estado} color={sm.color} bg={sm.bg} />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 16, marginTop: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: C.textSoft }}>📅 {n.fecha}</span>
                      <span style={{ fontSize: 12, color: C.textSoft }}>📋 {n.tipo}</span>
                      <span style={{ fontSize: 12, color: C.textSoft }}>🏥 {n.sede}</span>
                      <span style={{ fontSize: 12, color: C.textSoft }}>💬 {n.motivo}</span>
                    </div>
                    {n.obs && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6, fontStyle: "italic" }}>"{n.obs}"</div>}
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>Cargado el {n.fechaCarga} · Antelación: {n.antelacion}</div>
                  </div>
                </div>
              </Card>
            );
          })}
          {filtradas.length === 0 && (
            <Card style={{ padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 14, color: C.textMuted }}>No hay novedades con ese estado.</div>
            </Card>
          )}
        </div>

        {/* Panel acción */}
        {selected && selected.estado === "Pendiente" && (
          <div style={{ width: 280, flexShrink: 0 }}>
            <Card style={{ padding: 24, position: "sticky", top: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>Resolver novedad</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>{selected.profesional}</div>
              <Divider />
              <Label>Acción *</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                {acciones.map(a => (
                  <button key={a} onClick={() => setAccion(a)} style={{
                    padding: "9px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                    fontWeight: accion === a ? 700 : 500, textAlign: "left",
                    background: accion === a ? C.primary100 : C.white,
                    color: accion === a ? C.primary : C.textSoft,
                    border: accion === a ? `1.5px solid ${C.primary}` : `1.5px solid ${C.border}`,
                    fontFamily: "Lato, sans-serif",
                  }}>{a}</button>
                ))}
              </div>
              {comentarioObligatorio && (
                <div style={{ marginBottom: 16 }}>
                  <Label>Comentario *</Label>
                  <textarea value={comentario} onChange={e => setComentario(e.target.value)} rows={3}
                    placeholder="Explicá el motivo al profesional..."
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 12, color: C.text, background: C.white, boxSizing: "border-box", resize: "none", fontFamily: "Lato, sans-serif" }} />
                </div>
              )}
              <button onClick={handleAccion} style={{
                width: "100%",
                background: (accion && (!comentarioObligatorio || comentario.trim())) ? `linear-gradient(135deg, ${C.primary} 0%, ${C.accent} 100%)` : C.neutralBg,
                color: (accion && (!comentarioObligatorio || comentario.trim())) ? C.white : C.textMuted,
                border: "none", borderRadius: 8, padding: "11px", fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: "Lato, sans-serif",
              }}>
                Confirmar acción
              </button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────
function ViewDashboard() {
  const [periodo, setPeriodo] = useState("mes");

  return (
    <div style={{ padding: "36px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: "Lora, Georgia, serif", margin: "0 0 4px" }}>Dashboard</h2>
          <p style={{ fontSize: 13, color: C.textSoft, margin: 0 }}>Estadísticas de ausentismo y gestión de agendas.</p>
        </div>
        <div style={{ display: "flex", gap: 4, background: C.neutralBg, borderRadius: 10, padding: 4 }}>
          {["semana", "mes", "trimestre"].map(p => (
            <button key={p} onClick={() => setPeriodo(p)} style={{
              padding: "7px 16px", borderRadius: 7, fontSize: 12, cursor: "pointer",
              fontWeight: 600, border: "none", fontFamily: "Lato, sans-serif",
              background: periodo === p ? C.white : "transparent",
              color: periodo === p ? C.text : C.textMuted,
              boxShadow: periodo === p ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard label="Novedades en el período" value="47" sub="Marzo 2025" color={C.text} icon="📋" />
        <StatCard label="Antelación promedio" value="28 hs" sub="Sobre el total de avisos" color={C.primary} icon="⏱" />
        <StatCard label="Tasa de recuperación" value="38%" sub="Del total de cancelaciones" color={C.info} icon="🔄" />
        <StatCard label="Pendientes ahora" value="2" sub="Requieren acción" color={C.warn} icon="⚠" />
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {/* Cancelaciones por profesional */}
        <Card style={{ flex: 2, minWidth: 280, padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 18 }}>Cancelaciones por profesional</div>
          <BarRow label="Dr. Martín Ríos" value={12} max={14} color={C.primary} />
          <BarRow label="Dra. Valeria Suárez" value={9} max={14} color={C.primary} />
          <BarRow label="Dr. Sebastián Morales" value={7} max={14} color={C.accent} />
          <BarRow label="Dra. Claudia Herrera" value={6} max={14} color={C.accent} />
          <BarRow label="Dra. Natalia Quiroga" value={5} max={14} color={C.primary300} />
          <BarRow label="Dr. Pablo Ferreyra" value={4} max={14} color={C.primary300} />
        </Card>

        {/* Antelación */}
        <Card style={{ flex: 1, minWidth: 220, padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 18 }}>Distribución de antelación</div>
          {[
            { label: "Con anticipación (+72hs)", pct: 34, color: C.success },
            { label: "Normal (24–72hs)",          pct: 28, color: C.info   },
            { label: "Tardío (2–24hs)",            pct: 26, color: C.warn  },
            { label: "Último momento (−2hs)",      pct: 12, color: C.danger},
          ].map(r => (
            <div key={r.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: C.textSoft }}>{r.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.pct}%</span>
              </div>
              <div style={{ height: 5, background: C.neutralBg, borderRadius: 4 }}>
                <div style={{ height: 5, width: `${r.pct}%`, background: r.color, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </Card>

        {/* Por sede */}
        <Card style={{ flex: 1, minWidth: 220, padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 18 }}>Comparativa por sede</div>
          {[
            { sede: "Sede Palermo",   cancelaciones: 21, recup: "40%", antelacion: "31 hs" },
            { sede: "Sede Belgrano",  cancelaciones: 15, recup: "33%", antelacion: "22 hs" },
            { sede: "Sede Caballito", cancelaciones: 11, recup: "45%", antelacion: "38 hs" },
          ].map((s, i) => (
            <div key={s.sede} style={{ marginBottom: i < 2 ? 16 : 0, paddingBottom: i < 2 ? 16 : 0, borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>{s.sede}</div>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { val: s.cancelaciones, lbl: "cancelac.", color: C.text },
                  { val: s.recup,         lbl: "recup.",    color: C.success },
                  { val: s.antelacion,    lbl: "antelac.",  color: C.info },
                ].map(x => (
                  <div key={x.lbl}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: x.color, fontFamily: "Lora, Georgia, serif", lineHeight: 1 }}>{x.val}</div>
                    <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{x.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Card>

        {/* Motivos */}
        <Card style={{ flex: 1, minWidth: 220, padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 18 }}>Motivos más frecuentes</div>
          <BarRow label="Enfermedad"           value={18} max={20} color="#818CF8" />
          <BarRow label="Causa personal"       value={10} max={20} color="#818CF8" />
          <BarRow label="Licencia programada"  value={8}  max={20} color="#A78BFA" />
          <BarRow label="Capacitación"         value={6}  max={20} color="#A78BFA" />
          <BarRow label="Guardia institucional" value={5} max={20} color="#C4B5FD" />
        </Card>
      </div>
    </div>
  );
}

// ─── App shell ────────────────────────────────────────────────
export default function App() {
  const [rol, setRol] = useState("centro");
  const [vista, setVista] = useState("novedades");
  const [novedades, setNovedades] = useState(novedadesInit);

  const handleSubmit = (form) => {
    setNovedades(prev => [{
      id: Date.now(),
      profesional: "Dra. Natalia Quiroga",
      iniciales: "NQ",
      especialidad: "Clínica Médica",
      sede: form.sede,
      tipo: form.tipo,
      fecha: form.fecha,
      motivo: form.motivo,
      estado: "Pendiente",
      antelacion: "48 hs",
      etiqueta: "Con anticipación",
      obs: form.obs,
      fechaCarga: new Date().toLocaleString("es-AR"),
    }, ...prev]);
  };

  const handleAction = (id, accion) => {
    const estadoMap = {
      "Confirmar": "Confirmada",
      "Pedir aclaración": "En aclaración",
      "Confirmar recuperación": "Cerrada con recuperación",
      "Proponer nueva fecha": "En aclaración",
      "Rechazar recuperación": "Cerrada sin recuperación",
    };
    setNovedades(prev => prev.map(n => n.id === id ? { ...n, estado: estadoMap[accion] || "Confirmada" } : n));
  };

  const navCentro = [
    { id: "novedades", label: "Novedades", icon: "📋" },
    { id: "dashboard", label: "Dashboard",  icon: "📊" },
  ];
  const navProf = [
    { id: "nueva",    label: "Nuevo aviso", icon: "✏️" },
    { id: "misavisos", label: "Mis avisos", icon: "📋" },
  ];
  const nav = rol === "centro" ? navCentro : navProf;
  const pendientes = novedades.filter(n => n.estado === "Pendiente").length;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Lato, system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:wght@600;700;800&family=Lato:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Topbar */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58, position: "sticky", top: 0, zIndex: 10 }}>
        <Logo />

        {/* Selector de rol — solo para demo */}
        <div style={{ display: "flex", gap: 4, background: C.neutralBg, borderRadius: 10, padding: 4 }}>
          {[{ id: "profesional", label: "👨‍⚕️ Profesional" }, { id: "centro", label: "🏥 Centro / Admin" }].map(r => (
            <button key={r.id} onClick={() => { setRol(r.id); setVista(r.id === "profesional" ? "nueva" : "novedades"); }} style={{
              padding: "6px 14px", borderRadius: 7, fontSize: 12, cursor: "pointer",
              fontWeight: 600, border: "none", fontFamily: "Lato, sans-serif",
              background: rol === r.id ? C.white : "transparent",
              color: rol === r.id ? C.text : C.textMuted,
              boxShadow: rol === r.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}>{r.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            initials={rol === "profesional" ? "NQ" : "AS"}
            size={32}
            color={C.primary}
          />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
              {rol === "profesional" ? "Dra. Natalia Quiroga" : "Administración"}
            </div>
            <div style={{ fontSize: 11, color: C.textMuted }}>
              {rol === "profesional" ? "Clínica Médica" : "Todas las sedes"}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 58px)" }}>
        {/* Sidebar */}
        <div style={{ width: 210, background: C.white, borderRight: `1px solid ${C.border}`, padding: "24px 12px", flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: 1.5, textTransform: "uppercase", padding: "0 10px", marginBottom: 10 }}>
            {rol === "profesional" ? "Mi agenda" : "Gestión"}
          </div>

          {nav.map(n => (
            <button key={n.id} onClick={() => setVista(n.id)} style={{
              width: "100%", textAlign: "left", padding: "10px 14px", borderRadius: 9,
              fontSize: 13, cursor: "pointer", fontWeight: vista === n.id ? 700 : 500,
              background: vista === n.id ? C.primary100 : "transparent",
              color: vista === n.id ? C.primary : C.textSoft,
              border: "none", marginBottom: 2, display: "flex", alignItems: "center", gap: 10,
              fontFamily: "Lato, sans-serif",
            }}>
              <span style={{ fontSize: 15 }}>{n.icon}</span>
              <span>{n.label}</span>
              {n.id === "novedades" && rol === "centro" && pendientes > 0 && (
                <span style={{ marginLeft: "auto", background: C.warn, color: C.white, borderRadius: 20, fontSize: 10, fontWeight: 800, padding: "1px 7px" }}>{pendientes}</span>
              )}
            </button>
          ))}

          {/* Info centro */}
          <div style={{ marginTop: "auto", paddingTop: 20, borderTop: `1px solid ${C.border}`, marginTop: 24 }}>
            <div style={{ fontSize: 11, color: C.textMuted, padding: "0 10px" }}>Centro de Salud</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, padding: "4px 10px" }}>Grupo Médico Norte</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 8 }}>
              {SEDES.map(s => (
                <div key={s} style={{ fontSize: 11, color: C.textMuted, padding: "3px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.primary300 }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div style={{ flex: 1, padding: "0 40px", maxWidth: 1100, overflowY: "auto" }}>
          {vista === "nueva"     && <ViewNuevaNovedad onSubmit={handleSubmit} />}
          {vista === "misavisos" && <ViewMisAvisos novedades={novedades.filter(n => n.profesional === "Dra. Natalia Quiroga")} />}
          {vista === "novedades" && <ViewCentro novedades={novedades} onAction={handleAction} />}
          {vista === "dashboard" && <ViewDashboard />}
        </div>
      </div>
    </div>
  );
}
