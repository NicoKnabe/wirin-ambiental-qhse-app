import { useState, useRef } from "react";

// ─── DATA ESTÁTICA POR DEFECTO (PLANTILLA) ──────────────────────────────────
const defaultIperData = {
    filas: [
        {
            actividad: "Desplazamiento pedestre en terreno",
            peligro: "Superficies irregulares, obstáculos, desniveles",
            riesgo: "Caídas a mismo distinto nivel / Torceduras",
            riesgo_puro: { p: 8, c: 2, mr: 16, nivel: "Moderado" },
            controles: [
                { tipo: "Administración", medida: "Caminar solo por senderos habilitados. Mantener atención al entorno. No correr." },
                { tipo: "EPP", medida: "Uso obligatorio de calzado de seguridad (botines o zapatos caña alta)." }
            ],
            riesgo_residual: { p: 4, c: 2, mr: 8, nivel: "Aceptable" },
            legal: ["Ley 16.744", "DS 594 Art. 37"]
        },
        {
            actividad: "Conducción vehicular rutera",
            peligro: "Vehículos en movimiento, exceso de velocidad, fatiga",
            riesgo: "Choques, colisiones, volcamientos",
            riesgo_puro: { p: 8, c: 4, mr: 32, nivel: "Substancial" },
            controles: [
                { tipo: "Administración", medida: "Respetar límites de velocidad. Conducir a la defensiva. Curso manejo 4x4 si aplica." },
                { tipo: "Administración", medida: "Checklist pre-uso del vehículo diario." }
            ],
            riesgo_residual: { p: 2, c: 4, mr: 8, nivel: "Aceptable" },
            legal: ["Ley 18.290 de Tránsito", "Decreto 170 MINTRAB"]
        },
        {
            actividad: "Exposición a factores climáticos",
            peligro: "Radiación Ultravioleta (UV) de origen solar",
            riesgo: "Quemaduras solares, insolación, cáncer de piel a largo plazo",
            riesgo_puro: { p: 8, c: 3, mr: 24, nivel: "Moderado" },
            controles: [
                { tipo: "Administración", medida: "Evitar exposición directa entre las 11:00 y las 16:00 horas si es posible." },
                { tipo: "EPP", medida: "Uso de bloqueador solar factor 50+, lentes con filtro UV, legionario y manga larga." }
            ],
            riesgo_residual: { p: 4, c: 3, mr: 12, nivel: "Aceptable" },
            legal: ["Ley 20.096", "Guía Técnica Radiación UV Minsal"]
        },
        {
            actividad: "Trabajo en solitario (zonas remotas)",
            peligro: "Aislamiento, falta de comunicación oportuna ante emergencia",
            riesgo: "Agravamiento de lesiones, retraso en rescate",
            riesgo_puro: { p: 4, c: 4, mr: 16, nivel: "Moderado" },
            controles: [
                { tipo: "Ingeniería", medida: "Portar dispositivo de comunicación satelital (InReach) o radio." },
                { tipo: "Administración", medida: "Definir horario de reportes. Sistema de monitoreo de personal." }
            ],
            riesgo_residual: { p: 2, c: 4, mr: 8, nivel: "Aceptable" },
            legal: ["DS 594 (Saneamiento)", "Protocolo de Emergencias Wirin"]
        }
    ]
};

// ─── HELPERS ────────────────────────────────────────────────────────────────
const NIVEL_COLORS = {
    Substancial: { bg: "#fde8e8", text: "#c0392b", border: "#e74c3c", badge: "#c0392b" },
    Moderado: { bg: "#fef3e2", text: "#e67e22", border: "#f39c12", badge: "#e67e22" },
    Aceptable: { bg: "#e8f8f0", text: "#27ae60", border: "#2ecc71", badge: "#27ae60" },
};

const TIPO_COLORS = {
    "Ingeniería": { bg: "#2980b9", label: "ING" },
    "Administración": { bg: "#8e44ad", label: "ADM" },
    "EPP": { bg: "#16a085", label: "EPP" },
    "Eliminación": { bg: "#c0392b", label: "ELIM" },
    "Sustitución": { bg: "#d35400", label: "SUST" },
};

function NivelBadge({ nivel, mr, p, c }) {
    const col = NIVEL_COLORS[nivel] || NIVEL_COLORS.Aceptable;
    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 3 }}>
                P: <b>{p}</b> × C: <b>{c}</b>
            </div>
            <div style={{
                fontSize: 20, fontWeight: 900, color: col.text, lineHeight: 1,
            }}>{mr}</div>
            <span style={{
                display: "inline-block", marginTop: 4,
                background: col.badge, color: "#fff",
                borderRadius: 20, padding: "2px 10px",
                fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
                textTransform: "uppercase",
            }}>{nivel}</span>
        </div>
    );
}

function CtrlTag({ tipo }) {
    const t = TIPO_COLORS[tipo] || { bg: "#555", label: tipo.slice(0, 3).toUpperCase() };
    return (
        <span style={{
            background: t.bg, color: "#fff",
            borderRadius: 3, padding: "1px 6px",
            fontSize: 8.5, fontWeight: 700,
            whiteSpace: "nowrap", flexShrink: 0, marginTop: 1,
        }}>{t.label}</span>
    );
}

// ─── COMPONENTE PRINCIPAL (LAYOUT DIVIDIDO) ──────────────────────────────────
export default function IPERModule() {
    const today = new Date().toISOString().split("T")[0];
    const [proyecto, setProyecto] = useState("");
    const [mandante, setMandante] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [fecha, setFecha] = useState(today);

    // Usamos el JSON estático por defecto
    const iperData = {
        proyecto: proyecto || "Proyecto de Terreno (Plantilla Estándar)",
        mandante: mandante,
        ubicacion: ubicacion,
        fecha: fecha,
        filas: defaultIperData.filas
    };

    const tableRef = useRef(null);

    // ── Exportar HTML imprimible ─────────────────────────────────────────────
    function exportarHTML() {
        if (!iperData) return;
        const html = buildExportHTML(iperData);
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Matriz_IPER_${(iperData.proyecto || "proyecto").replace(/\s+/g, "_")}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: 13, color: "#1c2a38", display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

                {/* ============ LEFT PANEL: Formulario de Configuración ============ */}
                <div style={{
                    width: "350px",
                    minWidth: "300px",
                    background: "#f9fafb",
                    padding: "20px",
                    borderRight: "1px solid #e5e7eb",
                    overflowY: "auto",
                    boxShadow: "inset -4px 0 12px rgba(0,0,0,0.02)"
                }}>
                    <div style={{ marginBottom: "20px" }}>
                        <div style={{ fontSize: 10, color: "#e8a020", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
                            DS 44 · Wirin Ambiental
                        </div>
                        <h2 style={{ margin: "4px 0 2px", fontSize: 18, fontWeight: 800, color: "#1a2e4a" }}>
                            ⚠️ Matriz IPER
                        </h2>
                        <p style={{ color: "#6b7280", fontSize: 11, margin: 0 }}>
                            Configuración de Variables Generales
                        </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div>
                            <label style={labelStyle}>Proyecto / Contrato</label>
                            <input
                                style={inputStyle}
                                placeholder="Ej: Estudio de Flora y Fauna"
                                value={proyecto}
                                onChange={e => setProyecto(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Mandante / Cliente</label>
                            <input
                                style={inputStyle}
                                placeholder="Ej: Empresa Minera X"
                                value={mandante}
                                onChange={e => setMandante(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Ubicación / Sector</label>
                            <input
                                style={inputStyle}
                                placeholder="Ej: Faena Cordillera, Campamento"
                                value={ubicacion}
                                onChange={e => setUbicacion(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Fecha de Generación</label>
                            <input
                                type="date"
                                style={inputStyle}
                                value={fecha}
                                onChange={e => setFecha(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: "30px", padding: "16px", background: "#f0f4f8", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
                        <p style={{ fontSize: "11px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                            <strong>Nota:</strong> Esta plantilla contiene riesgos precargados (Desplazamiento, Conducción vehicular, Radiación UV, Trabajo en solitario). Para generar el PDF local en HTML pulse el botón <strong>Exportar HTML</strong> en la vista previa.
                        </p>
                    </div>
                </div>

                {/* ============ RIGHT PANEL: Vista Previa IPER ============ */}
                <div style={{ flex: 1, padding: "24px", overflowY: "auto", background: "#e8eee8" }}>

                    {/* Header Dashboard IPER */}
                    <div style={{
                        background: "linear-gradient(135deg, #1a2e4a 0%, #2c4a72 100%)",
                        borderRadius: "10px 10px 0 0", padding: "18px 22px",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        boxShadow: "0 4px 16px rgba(26,46,74,0.3)",
                    }}>
                        <div>
                            <h2 style={{ color: "#fff", margin: "0 0 2px", fontSize: 18, fontWeight: 800 }}>
                                📑 Vista Previa: Matriz {iperData.proyecto}
                            </h2>
                            <p style={{ color: "#b0c4de", fontSize: 11, margin: 0 }}>
                                {iperData.mandante && `Mandante: ${iperData.mandante} · `}
                                {iperData.ubicacion && `Ubicación: ${iperData.ubicacion} · `}
                                Fecha: {iperData.fecha}
                            </p>
                        </div>

                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <div style={{ display: "flex", gap: "6px" }}>
                                {["Substancial", "#c0392b", "Moderado", "#e67e22", "Aceptable", "#27ae60"].reduce((result, value, index, array) => {
                                    if (index % 2 === 0)
                                        result.push(
                                            <span key={value} style={{ background: array[index + 1], color: "#fff", borderRadius: 4, padding: "3px 9px", fontSize: 9, fontWeight: 700 }}>
                                                ● {value}
                                            </span>
                                        );
                                    return result;
                                }, [])}
                            </div>
                            <button
                                onClick={exportarHTML}
                                style={{
                                    background: "#e8a020", color: "#fff", border: "none",
                                    borderRadius: 6, padding: "8px 16px", fontSize: 12,
                                    fontWeight: 800, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                    transition: "transform 0.1s"
                                }}
                                onMouseDown={e => e.currentTarget.style.transform = "scale(0.96)"}
                                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                            >
                                ⬇ Exportar HTML
                            </button>
                        </div>
                    </div>

                    {/* Tabla IPER */}
                    <div ref={tableRef} style={{ background: "white", overflowX: "auto", borderRadius: "0 0 10px 10px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5, minWidth: 900 }}>
                            <thead>
                                <tr>
                                    {["① Actividad", "② Peligro", "③ Riesgo / Incidente", "④ Riesgo Puro\nP×C=MR", "⑤ Controles DS 44", "⑥ Riesgo Residual\nP×C=MR", "⑦ Requisitos Legales"].map(h => (
                                        <th key={h} style={{
                                            background: "#e2e8f0", color: "#1e293b", padding: "12px 8px",
                                            textAlign: "center", fontSize: 10, fontWeight: 800,
                                            textTransform: "uppercase", letterSpacing: 0.5,
                                            border: "1px solid #cbd5e1",
                                            whiteSpace: "pre-line", lineHeight: 1.4,
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {iperData.filas?.map((fila, i) => {
                                    const nivelPuro = NIVEL_COLORS[fila.riesgo_puro?.nivel] || NIVEL_COLORS.Aceptable;
                                    return (
                                        <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                                            {/* Actividad */}
                                            <td style={{
                                                padding: "10px 8px", border: "1px solid #e2e8f0",
                                                fontWeight: 700, fontSize: 10, textTransform: "uppercase",
                                                color: "#0f172a", borderLeft: "4px solid #e8a020",
                                                verticalAlign: "top", minWidth: 120,
                                            }}>{fila.actividad}</td>

                                            {/* Peligro */}
                                            <td style={{ padding: "10px 8px", border: "1px solid #e2e8f0", verticalAlign: "top", minWidth: 140 }}>
                                                {fila.peligro}
                                            </td>

                                            {/* Riesgo */}
                                            <td style={{ padding: "10px 8px", border: "1px solid #e2e8f0", verticalAlign: "top", minWidth: 140 }}>
                                                {fila.riesgo}
                                            </td>

                                            {/* Riesgo Puro */}
                                            <td style={{
                                                padding: "10px 8px", border: "1px solid #e2e8f0",
                                                verticalAlign: "middle", background: nivelPuro.bg,
                                                minWidth: 110,
                                            }}>
                                                <NivelBadge {...fila.riesgo_puro} nivel={fila.riesgo_puro?.nivel} />
                                            </td>

                                            {/* Controles */}
                                            <td style={{ padding: "10px 8px", border: "1px solid #e2e8f0", verticalAlign: "top", minWidth: 220 }}>
                                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                                    {fila.controles?.map((ctrl, j) => (
                                                        <div key={j} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                                                            <CtrlTag tipo={ctrl.tipo} />
                                                            <span style={{ fontSize: 10, lineHeight: 1.5, color: "#334155" }}>{ctrl.medida}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>

                                            {/* Riesgo Residual */}
                                            <td style={{
                                                padding: "10px 8px", border: "1px solid #e2e8f0",
                                                verticalAlign: "middle",
                                                background: (NIVEL_COLORS[fila.riesgo_residual?.nivel] || NIVEL_COLORS.Aceptable).bg,
                                                minWidth: 110,
                                            }}>
                                                <NivelBadge {...fila.riesgo_residual} nivel={fila.riesgo_residual?.nivel} />
                                            </td>

                                            {/* Legal */}
                                            <td style={{ padding: "10px 8px", border: "1px solid #e2e8f0", verticalAlign: "top", minWidth: 140 }}>
                                                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                                                    {fila.legal?.map((l, j) => (
                                                        <li key={j} style={{
                                                            padding: "3px 0", fontSize: 9.5, color: "#475569",
                                                            borderBottom: j < fila.legal.length - 1 ? "1px dashed #cbd5e1" : "none",
                                                        }}>{l}</li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Footer stats in Table */}
                        <div style={{ padding: "12px", background: "#f1f5f9", borderTop: "1px solid #e2e8f0", display: "flex", gap: 10, flexWrap: "wrap" }}>
                            {["Substancial", "Moderado", "Aceptable"].map(nivel => {
                                const count = iperData.filas?.filter(f => f.riesgo_puro?.nivel === nivel).length || 0;
                                const col = NIVEL_COLORS[nivel];
                                return count > 0 ? (
                                    <div key={nivel} style={{
                                        background: col.bg, border: `1px solid ${col.border}`,
                                        borderRadius: 6, padding: "5px 12px",
                                        fontSize: 10, color: col.text, fontWeight: 700,
                                    }}>
                                        {nivel}: {count} riesgo{count !== 1 ? "s" : ""} puro{count !== 1 ? "s" : ""}
                                    </div>
                                ) : null;
                            })}
                            <div style={{
                                background: "#e8f8f0", border: "1px solid #2ecc71",
                                borderRadius: 6, padding: "5px 12px",
                                fontSize: 10, color: "#27ae60", fontWeight: 700,
                            }}>
                                ✓ {iperData.filas?.filter(f => f.riesgo_residual?.nivel === "Aceptable").length || 0} riesgos residuales Aceptables
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Estilos reutilizables ───────────────────────────────────────────────────
const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 700,
    color: "#475569", marginBottom: 6, textTransform: "uppercase",
    letterSpacing: 0.5,
};

const inputStyle = {
    width: "100%", padding: "10px 12px",
    border: "1px solid #cbd5e1", borderRadius: 6,
    fontSize: 13, color: "#0f172a", outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
    background: "#fff",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)"
};

// ─── HTML de exportación ─────────────────────────────────────────────────────
function buildExportHTML(data) {
    const rows = data.filas?.map(f => {
        const nivelPuro = { Substancial: "#c0392b", Moderado: "#e67e22", Aceptable: "#27ae60" };
        const tipoBg = { "Ingeniería": "#2980b9", "Administración": "#8e44ad", "EPP": "#16a085", "Eliminación": "#c0392b", "Sustitución": "#d35400" };
        const bgPuro = { Substancial: "#fde8e8", Moderado: "#fef3e2", Aceptable: "#e8f8f0" };

        const controles = (f.controles || []).map(c => `
      <div style="display:flex;gap:5px;align-items:flex-start;margin-bottom:4px;">
        <span style="background:${tipoBg[c.tipo] || "#555"};color:#fff;border-radius:3px;padding:1px 5px;font-size:8.5px;font-weight:700;white-space:nowrap;">${c.tipo.slice(0, 4).toUpperCase()}</span>
        <span style="font-size:10px;line-height:1.5;">${c.medida}</span>
      </div>`).join("");

        const legal = (f.legal || []).map(l => `<li style="padding:2px 0;font-size:9.5px;border-bottom:1px dashed #dde5f0;">${l}</li>`).join("");

        const riskCell = (r) => r ? `
      <div style="text-align:center;">
        <div style="font-size:10px;color:#666;">P:<b>${r.p}</b> × C:<b>${r.c}</b></div>
        <div style="font-size:20px;font-weight:900;color:${nivelPuro[r.nivel] || "#27ae60"}">${r.mr}</div>
        <span style="background:${nivelPuro[r.nivel] || "#27ae60"};color:#fff;border-radius:20px;padding:2px 9px;font-size:9px;font-weight:700;">${r.nivel}</span>
      </div>` : "";

        return `<tr style="background:${Math.random() > 0.5 ? "#f7f9fc" : "#fff"}">
      <td style="padding:8px;border:1px solid #c8d6e5;font-weight:700;font-size:10px;text-transform:uppercase;color:#1a2e4a;border-left:4px solid #e8a020;vertical-align:top;">${f.actividad}</td>
      <td style="padding:8px;border:1px solid #c8d6e5;vertical-align:top;font-size:10.5px;">${f.peligro}</td>
      <td style="padding:8px;border:1px solid #c8d6e5;vertical-align:top;font-size:10.5px;">${f.riesgo}</td>
      <td style="padding:8px;border:1px solid #c8d6e5;vertical-align:middle;background:${bgPuro[f.riesgo_puro?.nivel] || "#e8f8f0"};">${riskCell(f.riesgo_puro)}</td>
      <td style="padding:8px;border:1px solid #c8d6e5;vertical-align:top;">${controles}</td>
      <td style="padding:8px;border:1px solid #c8d6e5;vertical-align:middle;background:${bgPuro[f.riesgo_residual?.nivel] || "#e8f8f0"};">${riskCell(f.riesgo_residual)}</td>
      <td style="padding:8px;border:1px solid #c8d6e5;vertical-align:top;"><ul style="margin:0;padding:0;list-style:none;">${legal}</ul></td>
    </tr>`;
    }).join("");

    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Matriz IPER — ${data.proyecto}</title>
<style>body{font-family:'Segoe UI',Arial,sans-serif;font-size:11px;padding:20px;color:#1c2a38;} table{width:100%;border-collapse:collapse;} th{background:#2c4a72;color:#fff;padding:9px 8px;font-size:9.5px;font-weight:700;text-transform:uppercase;border:1px solid rgba(255,255,255,0.2);} @media print{body{padding:0;}}</style>
</head><body>
<div style="background:linear-gradient(135deg,#1a2e4a,#2c4a72);color:#fff;padding:18px 22px;border-radius:8px;margin-bottom:16px;">
  <div style="font-size:10px;color:#e8a020;font-weight:700;letter-spacing:2px;">DS 44 · GESTIÓN PREVENTIVA DE RIESGOS LABORALES</div>
  <h1 style="font-size:18px;margin:4px 0 2px;">⚠️ Matriz IPER — ${data.proyecto}</h1>
  <p style="color:#b0c4de;font-size:11px;margin:0;">Generada: ${data.fecha} · Mandante: ${data.mandante || 'N/A'} · Ubicación: ${data.ubicacion || 'N/A'}</p>
</div>
<table>
<thead><tr>
  <th>① Actividad</th><th>② Peligro</th><th>③ Riesgo / Incidente</th>
  <th>④ Riesgo Puro P×C=MR</th><th>⑤ Controles DS 44</th>
  <th>⑥ Riesgo Residual P×C=MR</th><th>⑦ Requisitos Legales</th>
</tr></thead>
<tbody>${rows}</tbody>
</table>
<div style="margin-top:10px;font-size:9.5px;color:#666;border-top:1px solid #dde;padding-top:8px;">
  Aceptable ≤ 14 &nbsp;|&nbsp; Moderado 15–24 &nbsp;|&nbsp; Substancial ≥ 25 &nbsp;|&nbsp; Generado por Wirin Ambiental QHSE App
</div>
</body></html>`;
}
