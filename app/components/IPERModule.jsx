import { useState, useRef } from "react";

// ─── SYSTEM PROMPT DEL AGENTE IA ────────────────────────────────────────────
const SYSTEM_PROMPT = `Eres un Ingeniero QHSE Experto en Prevención de Riesgos con profundo conocimiento de la normativa chilena, incluyendo el nuevo DS 44 sobre gestión preventiva de riesgos laborales, Ley 16.744, DS 594, Ley 20.001, Ley 20.096, Ley 18.290 y toda la legislación vigente.

Tu tarea es generar una Matriz IPER (Identificación de Peligros y Evaluación de Riesgos) completa y técnicamente rigurosa.

REGLAS OBLIGATORIAS:
1. Responde SOLO con un objeto JSON válido, sin texto adicional, sin bloques markdown, sin explicaciones.
2. La metodología de evaluación es P × C = MR (Probabilidad × Consecuencia = Magnitud del Riesgo).
   - Probabilidad (P): escala 1–16
   - Consecuencia (C): escala 1–4
   - MR Aceptable: ≤ 14 | MR Moderado: 15–24 | MR Substancial: ≥ 25
3. Jerarquía de Controles según DS 44: Eliminación → Sustitución → Ingeniería → Administración → EPP
4. Cada actividad puede tener múltiples peligros. Identifica TODOS los peligros relevantes para cada actividad.
5. Siempre demuestra reducción del riesgo: el Riesgo Residual DEBE ser menor al Riesgo Puro.
6. Asigna normativa legal específica y actualizada (DS 44, DS 594, leyes específicas).

FORMATO JSON DE RESPUESTA (sin texto extra, solo el JSON):
{
  "proyecto": "nombre del proyecto",
  "fecha": "fecha generación",
  "filas": [
    {
      "actividad": "nombre de la actividad",
      "peligro": "descripción del peligro",
      "riesgo": "consecuencia / tipo de incidente",
      "riesgo_puro": {
        "p": 12,
        "c": 3,
        "mr": 36,
        "nivel": "Substancial"
      },
      "controles": [
        { "tipo": "Ingeniería", "medida": "descripción de la medida de ingeniería" },
        { "tipo": "Administración", "medida": "descripción del control administrativo" },
        { "tipo": "EPP", "medida": "descripción del EPP requerido" }
      ],
      "riesgo_residual": {
        "p": 4,
        "c": 2,
        "mr": 8,
        "nivel": "Aceptable"
      },
      "legal": ["Ley 16.744", "DS 594 Art. 109", "DS 44 Art. 20"]
    }
  ]
}`;

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

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
export default function IPERModule() {
    const [actividades, setActividades] = useState(
        "- Desplazamiento pedestre en terreno (recorrido de reconocimiento)\n- Instalación de trampas de muestreo de fauna\n- Conducción vehicular en rutas y caminos rurales"
    );
    const [proyecto, setProyecto] = useState("");
    const [contexto, setContexto] = useState("");
    const [loading, setLoading] = useState(false);
    const [iperData, setIperData] = useState(null);
    const [error, setError] = useState("");
    const [progress, setProgress] = useState("");
    const tableRef = useRef(null);

    // ── Llamada a la API ────────────────────────────────────────────────────
    async function generarIPER() {
        if (!actividades.trim()) {
            setError("Por favor ingresa al menos una actividad.");
            return;
        }
        setLoading(true);
        setError("");
        setIperData(null);
        setProgress("Analizando actividades y peligros…");

        const userPrompt = `Genera una Matriz IPER completa para el siguiente proyecto y actividades.

PROYECTO: ${proyecto || "Proyecto de Terreno — Estudio Ambiental"}
CONTEXTO ADICIONAL: ${contexto || "Trabajo de terreno en áreas naturales, personal expuesto a condiciones ambientales variables."}

ACTIVIDADES / PROCESOS A EVALUAR:
${actividades}

Identifica TODOS los peligros relevantes para cada actividad (mínimo 2–3 peligros por actividad).
Incluye riesgos ambientales, físicos, biológicos, ergonómicos y viales según corresponda.
Aplica la normativa chilena más específica y actualizada para cada riesgo.
Usa el campo "proyecto" con el valor: "${proyecto || "Proyecto de Terreno"}"
Usa el campo "fecha" con: "${new Date().toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}"`;

        try {
            setProgress("Consultando agente QHSE con IA…");
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
                body: JSON.stringify({
                    model: "claude-3-5-sonnet-20241022",
                    max_tokens: 8000,
                    system: SYSTEM_PROMPT,
                    messages: [{ role: "user", content: userPrompt }],
                }),
            });

            if (!response.ok) throw new Error(`Error API: ${response.status}`);

            const data = await response.json();
            setProgress("Procesando matriz…");

            const rawText = data.content
                .filter(b => b.type === "text")
                .map(b => b.text)
                .join("");

            // Extraer JSON robusto
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("La IA no devolvió un JSON válido. Intenta de nuevo.");

            const parsed = JSON.parse(jsonMatch[0]);
            setIperData(parsed);
            setProgress("");
        } catch (err) {
            setError(err.message || "Error inesperado. Intenta de nuevo.");
            setProgress("");
        } finally {
            setLoading(false);
        }
    }

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
        <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: 13, color: "#1c2a38" }}>

            {/* ── HEADER ─────────────────────────────────────────────────────── */}
            <div style={{
                background: "linear-gradient(135deg, #1a2e4a 0%, #2c4a72 100%)",
                borderRadius: 10, padding: "18px 22px", marginBottom: 18,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: "0 4px 16px rgba(26,46,74,0.3)",
            }}>
                <div>
                    <div style={{ fontSize: 10, color: "#e8a020", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
                        DS 44 · Gestión Preventiva de Riesgos
                    </div>
                    <h2 style={{ color: "#fff", margin: "4px 0 2px", fontSize: 18, fontWeight: 800 }}>
                        ⚠️ Generador de Matriz IPER con IA
                    </h2>
                    <p style={{ color: "#b0c4de", fontSize: 11, margin: 0 }}>
                        Identificación de Peligros y Evaluación de Riesgos · Metodología P × C = MR
                    </p>
                </div>
                <div style={{
                    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 8, padding: "8px 14px", fontSize: 10, color: "#dce8f5", lineHeight: 1.8,
                }}>
                    <div><span style={{ color: "#e8a020", fontWeight: 700 }}>✓</span> Jerarquía de Controles DS 44</div>
                    <div><span style={{ color: "#e8a020", fontWeight: 700 }}>✓</span> Normativa Chilena Actualizada</div>
                    <div><span style={{ color: "#e8a020", fontWeight: 700 }}>✓</span> Evaluación Cuantitativa P×C=MR</div>
                </div>
            </div>

            {/* ── FORMULARIO ─────────────────────────────────────────────────── */}
            <div style={{
                background: "#fff", borderRadius: 10, padding: 20,
                border: "1px solid #c8d6e5", marginBottom: 16,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#2c4a72", marginBottom: 14 }}>
                    📋 Datos del Proyecto
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div>
                        <label style={labelStyle}>Nombre del Proyecto</label>
                        <input
                            style={inputStyle}
                            placeholder="Ej: Estudio de Impacto Ambiental Sector Norte"
                            value={proyecto}
                            onChange={e => setProyecto(e.target.value)}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Contexto / Condiciones de Trabajo</label>
                        <input
                            style={inputStyle}
                            placeholder="Ej: Terreno rural, zonas de quebrada, clima frío"
                            value={contexto}
                            onChange={e => setContexto(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>
                        Actividades / Procesos a Evaluar
                        <span style={{ color: "#888", fontWeight: 400, marginLeft: 6 }}>
                            (una por línea, o separadas por comas)
                        </span>
                    </label>
                    <textarea
                        style={{ ...inputStyle, minHeight: 110, resize: "vertical", fontFamily: "inherit" }}
                        placeholder={"- Desplazamiento pedestre en terreno\n- Instalación de trampas de fauna\n- Conducción vehicular\n- Muestreo de flora\n- Trabajo nocturno"}
                        value={actividades}
                        onChange={e => setActividades(e.target.value)}
                    />
                </div>

                <button
                    onClick={generarIPER}
                    disabled={loading}
                    style={{
                        marginTop: 14, width: "100%", padding: "12px 0",
                        background: loading ? "#93a8c4" : "linear-gradient(135deg, #1a2e4a, #2c4a72)",
                        color: "#fff", border: "none", borderRadius: 8,
                        fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                        letterSpacing: 0.5, transition: "all 0.2s",
                        boxShadow: loading ? "none" : "0 4px 12px rgba(26,46,74,0.35)",
                    }}
                >
                    {loading ? `⏳ ${progress || "Generando…"}` : "⚙️ Generar Matriz IPER con IA"}
                </button>
            </div>

            {/* ── ERROR ──────────────────────────────────────────────────────── */}
            {error && (
                <div style={{
                    background: "#fde8e8", border: "1px solid #e74c3c", borderRadius: 8,
                    padding: "10px 14px", color: "#c0392b", fontSize: 12, marginBottom: 14,
                }}>
                    ❌ {error}
                </div>
            )}

            {/* ── LOADING SKELETON ───────────────────────────────────────────── */}
            {loading && (
                <div style={{ background: "#fff", borderRadius: 10, padding: 20, border: "1px solid #c8d6e5" }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                            {[9, 10, 12, 9, 26, 9, 12].map((w, j) => (
                                <div key={j} style={{
                                    flex: w, height: 60, borderRadius: 6,
                                    background: "linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%)",
                                    backgroundSize: "200% 100%",
                                    animation: "shimmer 1.4s infinite",
                                }} />
                            ))}
                        </div>
                    ))}
                    <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
                </div>
            )}

            {/* ── TABLA IPER ─────────────────────────────────────────────────── */}
            {iperData && !loading && (
                <div>
                    {/* Toolbar */}
                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        marginBottom: 10, flexWrap: "wrap", gap: 8,
                    }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#1a2e4a" }}>
                                📊 {iperData.proyecto}
                            </h3>
                            <p style={{ margin: 0, fontSize: 10, color: "#666" }}>
                                {iperData.filas?.length} riesgos identificados · {iperData.fecha}
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            {/* Leyenda */}
                            {[["Substancial", "#c0392b"], ["Moderado", "#e67e22"], ["Aceptable", "#27ae60"]].map(([l, c]) => (
                                <span key={l} style={{
                                    background: c, color: "#fff", borderRadius: 4,
                                    padding: "3px 9px", fontSize: 9, fontWeight: 700,
                                }}>● {l}</span>
                            ))}
                            <button onClick={exportarHTML} style={{
                                background: "#1a2e4a", color: "#fff", border: "none",
                                borderRadius: 6, padding: "5px 14px", fontSize: 11,
                                fontWeight: 700, cursor: "pointer",
                            }}>⬇ Exportar HTML</button>
                        </div>
                    </div>

                    {/* Tabla */}
                    <div ref={tableRef} style={{ overflowX: "auto", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5, minWidth: 900 }}>
                            <thead>
                                <tr>
                                    {["① Actividad", "② Peligro", "③ Riesgo / Incidente", "④ Riesgo Puro\nP×C=MR", "⑤ Controles DS 44", "⑥ Riesgo Residual\nP×C=MR", "⑦ Requisitos Legales"].map(h => (
                                        <th key={h} style={{
                                            background: "#2c4a72", color: "#fff", padding: "9px 8px",
                                            textAlign: "center", fontSize: 9.5, fontWeight: 700,
                                            textTransform: "uppercase", letterSpacing: 0.5,
                                            border: "1px solid rgba(255,255,255,0.15)",
                                            whiteSpace: "pre-line", lineHeight: 1.4,
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {iperData.filas?.map((fila, i) => {
                                    const nivelPuro = NIVEL_COLORS[fila.riesgo_puro?.nivel] || NIVEL_COLORS.Aceptable;
                                    return (
                                        <tr key={i} style={{ background: i % 2 === 0 ? "#f7f9fc" : "#fff" }}>
                                            {/* Actividad */}
                                            <td style={{
                                                padding: "8px 8px", border: "1px solid #c8d6e5",
                                                fontWeight: 700, fontSize: 10, textTransform: "uppercase",
                                                color: "#1a2e4a", borderLeft: "4px solid #e8a020",
                                                verticalAlign: "top", minWidth: 110,
                                            }}>{fila.actividad}</td>

                                            {/* Peligro */}
                                            <td style={{ padding: "8px 8px", border: "1px solid #c8d6e5", verticalAlign: "top", minWidth: 120 }}>
                                                {fila.peligro}
                                            </td>

                                            {/* Riesgo */}
                                            <td style={{ padding: "8px 8px", border: "1px solid #c8d6e5", verticalAlign: "top", minWidth: 140 }}>
                                                {fila.riesgo}
                                            </td>

                                            {/* Riesgo Puro */}
                                            <td style={{
                                                padding: "8px 8px", border: "1px solid #c8d6e5",
                                                verticalAlign: "middle", background: nivelPuro.bg,
                                                minWidth: 100,
                                            }}>
                                                <NivelBadge {...fila.riesgo_puro} nivel={fila.riesgo_puro?.nivel} />
                                            </td>

                                            {/* Controles */}
                                            <td style={{ padding: "8px 8px", border: "1px solid #c8d6e5", verticalAlign: "top", minWidth: 200 }}>
                                                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                                    {fila.controles?.map((ctrl, j) => (
                                                        <div key={j} style={{ display: "flex", gap: 5, alignItems: "flex-start" }}>
                                                            <CtrlTag tipo={ctrl.tipo} />
                                                            <span style={{ fontSize: 10, lineHeight: 1.5, color: "#2c3e50" }}>{ctrl.medida}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>

                                            {/* Riesgo Residual */}
                                            <td style={{
                                                padding: "8px 8px", border: "1px solid #c8d6e5",
                                                verticalAlign: "middle",
                                                background: (NIVEL_COLORS[fila.riesgo_residual?.nivel] || NIVEL_COLORS.Aceptable).bg,
                                                minWidth: 100,
                                            }}>
                                                <NivelBadge {...fila.riesgo_residual} nivel={fila.riesgo_residual?.nivel} />
                                            </td>

                                            {/* Legal */}
                                            <td style={{ padding: "8px 8px", border: "1px solid #c8d6e5", verticalAlign: "top", minWidth: 130 }}>
                                                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                                                    {fila.legal?.map((l, j) => (
                                                        <li key={j} style={{
                                                            padding: "2px 0", fontSize: 9.5,
                                                            borderBottom: j < fila.legal.length - 1 ? "1px dashed #dde5f0" : "none",
                                                        }}>{l}</li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer stats */}
                    <div style={{
                        marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap",
                    }}>
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
            )}
        </div>
    );
}

// ─── Estilos reutilizables ───────────────────────────────────────────────────
const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 700,
    color: "#2c4a72", marginBottom: 5, textTransform: "uppercase",
    letterSpacing: 0.5,
};

const inputStyle = {
    width: "100%", padding: "8px 10px",
    border: "1.5px solid #c8d6e5", borderRadius: 6,
    fontSize: 12, color: "#1c2a38", outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
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
  <p style="color:#b0c4de;font-size:11px;margin:0;">Generada: ${data.fecha} · Metodología P × C = MR · Ley 16.744</p>
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
