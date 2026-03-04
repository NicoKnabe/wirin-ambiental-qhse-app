"use client";

import Letterhead from "../Letterhead";
import { IPERData } from "../forms/IPERForm";
import { MATRIZ_BASE } from "../IPERModule"; // We'll extract this data to be importable

interface IPERPreviewProps { data: IPERData; }

// ─── HELPERS DE COLORES Y ETIQUETAS ──────────────────────────────────────────
const NIVEL_COLORS: Record<string, { bg: string, text: string, border: string, badge: string }> = {
    Substancial: { bg: "#fde8e8", text: "#c0392b", border: "#e74c3c", badge: "#c0392b" },
    Moderado: { bg: "#fef3e2", text: "#e67e22", border: "#f39c12", badge: "#e67e22" },
    Aceptable: { bg: "#e8f8f0", text: "#27ae60", border: "#2ecc71", badge: "#27ae60" },
};

const TIPO_COLORS: Record<string, { bg: string, label: string }> = {
    "Ingeniería": { bg: "#2980b9", label: "ING" },
    "Administración": { bg: "#8e44ad", label: "ADM" },
    "EPP": { bg: "#16a085", label: "EPP" },
};

function NivelBadge({ nivel, mr, p, c }: { nivel: string, mr: number, p: number, c: number }) {
    const col = NIVEL_COLORS[nivel] || NIVEL_COLORS.Aceptable;
    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "6.5pt", color: "#666", marginBottom: 2 }}>
                P: <b>{p}</b> × C: <b>{c}</b>
            </div>
            <div style={{
                fontSize: "12pt", fontWeight: 900, color: col.text, lineHeight: 1,
            }}>{mr}</div>
            <span style={{
                display: "inline-block", marginTop: 2,
                background: col.badge, color: "#fff",
                borderRadius: 12, padding: "1px 6px",
                fontSize: "5.5pt", fontWeight: 700, letterSpacing: 0.5,
                textTransform: "uppercase",
            }}>{nivel}</span>
        </div>
    );
}

function CtrlTag({ tipo }: { tipo: string }) {
    const t = TIPO_COLORS[tipo] || { bg: "#555", label: tipo.slice(0, 3).toUpperCase() };
    return (
        <span style={{
            background: t.bg, color: "#fff",
            borderRadius: 2, padding: "1px 4px",
            fontSize: "5.5pt", fontWeight: 700,
            whiteSpace: "nowrap", flexShrink: 0, marginTop: 1,
        }}>{t.label}</span>
    );
}

function fds(dateStr: string): string {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("es-CL");
}

export default function IPERPreview({ data }: IPERPreviewProps) {
    const CODE = "WA-IPER-001";
    const version = "1.0";
    const docDate = fds(data.fecha) || new Date().toLocaleDateString("es-CL");

    // Lógica de Agrupación (ROWSPAN)
    const filasAgrupadas = MATRIZ_BASE.filas.map((fila, index, array) => {
        let isFirstOfGroup = false;
        let rowSpanCount = 1;

        if (index === 0 || fila.actividad !== array[index - 1].actividad) {
            isFirstOfGroup = true;
            for (let i = index + 1; i < array.length; i++) {
                if (array[i].actividad === fila.actividad) {
                    rowSpanCount++;
                } else {
                    break;
                }
            }
        }
        return { ...fila, isFirstOfGroup, rowSpanCount };
    });

    return (
        <div id="iper-preview" className="pdf-document">
            <div className="pdf-page">
                <Letterhead documentTitle={`MATRIZ IPER DS44 — ${data.proyecto?.toUpperCase() || ""}`} docCode={CODE} version={version} date={docDate} currentPage={1} totalPages={1} />

                <div style={{ background: "linear-gradient(135deg, #1a2e4a 0%, #2c4a72 100%)", borderRadius: "8px", padding: "12px 16px", marginBottom: "12px", color: "white" }}>
                    <div style={{ fontSize: "7pt", letterSpacing: "0.2em", opacity: 0.7, marginBottom: "2px", textTransform: "uppercase" }}>Matriz de Identificación de Peligros y Evaluación de Riesgos</div>
                    <div style={{ fontSize: "14pt", fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif" }}>{data.proyecto || "Proyecto Base"}</div>
                    <div style={{ fontSize: "8pt", opacity: 0.85, marginTop: "2px" }}>Mandante: <strong>{data.mandante || "[Mandante]"}</strong> — Ubicación: <strong>{data.ubicacion || "[Ubicación]"}</strong></div>
                </div>

                {/* Tabla IPER Visual Optimizada para PDF */}
                <div style={{ background: "white", width: "100%", overflow: "hidden", border: "1px solid #cbd5e1", borderRadius: "4px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                        <thead>
                            <tr>
                                {[
                                    "① ACTIVIDAD",
                                    "② PELIGRO",
                                    "③ RIESGO / INCIDENTE",
                                    <span key="puro">④ EVALUACIÓN<br />RIESGO PURO<br />P × C = MR</span>,
                                    <span key="ctrl">⑤ JERARQUÍA DE<br />CONTROLES DS 44</span>,
                                    <span key="res">⑥ EVALUACIÓN<br />RIESGO RESIDUAL<br />P × C = MR</span>,
                                    <span key="leg">⑦ REQUISITOS<br />LEGALES</span>
                                ].map((h, i) => (
                                    <th key={i} style={{
                                        background: "#2c4a72", color: "#ffffff", padding: "4px 3px",
                                        textAlign: "center", verticalAlign: "middle", fontSize: "7pt", fontWeight: 800,
                                        textTransform: "uppercase", letterSpacing: 0.2,
                                        border: "1px solid #c8d6e5", lineHeight: 1.15,
                                        width: i === 0 ? "8%" : i === 1 ? "12%" : i === 2 ? "12%" : i === 3 ? "11%" : i === 4 ? "38%" : i === 5 ? "11%" : "8%"
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filasAgrupadas.map((fila, i) => {
                                const nivelPuro = NIVEL_COLORS[fila.riesgo_puro?.nivel] || NIVEL_COLORS.Aceptable;
                                return (
                                    <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "#fff", borderBottom: "1px solid #c8d6e5" }}>
                                        {/* Actividad */}
                                        {fila.isFirstOfGroup && (
                                            <td rowSpan={fila.rowSpanCount} style={{
                                                padding: "4px 3px", border: "1px solid #c8d6e5", borderLeft: "3px solid #e8a020",
                                                fontWeight: 700, fontSize: "6.5pt", textTransform: "uppercase",
                                                color: "#0f172a", verticalAlign: "middle", textAlign: "center",
                                                wordBreak: "break-word"
                                            }}>
                                                {fila.actividad.replace("\n", " ")}
                                            </td>
                                        )}

                                        {/* Peligro */}
                                        <td style={{ padding: "4px 3px", border: "1px solid #c8d6e5", verticalAlign: "middle", fontSize: "6.5pt", color: "#334155", wordBreak: "break-word" }}>
                                            {fila.peligro}
                                        </td>

                                        {/* Riesgo */}
                                        <td style={{ padding: "4px 3px", border: "1px solid #c8d6e5", verticalAlign: "middle", fontSize: "6.5pt", color: "#c0392b", fontWeight: 600, wordBreak: "break-word" }}>
                                            {fila.riesgo}
                                        </td>

                                        {/* Riesgo Puro */}
                                        <td style={{ padding: "4px 3px", border: "1px solid #c8d6e5", verticalAlign: "middle", background: nivelPuro.bg }}>
                                            <NivelBadge {...fila.riesgo_puro} nivel={fila.riesgo_puro?.nivel} />
                                        </td>

                                        {/* Controles */}
                                        <td style={{ padding: "4px 3px", border: "1px solid #c8d6e5", verticalAlign: "middle" }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                                {fila.controles?.map((ctrl: any, j: number) => (
                                                    <div key={j} style={{ display: "flex", gap: 4, alignItems: "flex-start", wordBreak: "break-word" }}>
                                                        <CtrlTag tipo={ctrl.tipo} />
                                                        <span style={{ fontSize: "6.5pt", lineHeight: 1.3, color: "#1e293b", textAlign: "left" }}>{ctrl.medida}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>

                                        {/* Riesgo Residual */}
                                        <td style={{ padding: "4px 3px", border: "1px solid #c8d6e5", verticalAlign: "middle", background: (NIVEL_COLORS[fila.riesgo_residual?.nivel] || NIVEL_COLORS.Aceptable).bg }}>
                                            <NivelBadge {...fila.riesgo_residual} nivel={fila.riesgo_residual?.nivel} />
                                        </td>

                                        {/* Legal */}
                                        <td style={{ padding: "4px 3px", border: "1px solid #c8d6e5", verticalAlign: "middle" }}>
                                            <ul style={{ margin: 0, paddingLeft: 10, fontSize: "6.5pt", color: "#475569", wordBreak: "break-word" }}>
                                                {fila.legal?.map((l: string, j: number) => (
                                                    <li key={j} style={{ paddingBottom: 2 }}>{l}</li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div style={{ padding: "6px", background: "#eef2f6", border: "1px solid #cbd5e1", borderTop: "none", display: "flex", justifyContent: "space-between", borderRadius: "0 0 4px 4px", marginBottom: "20px" }}>
                    <div style={{ fontSize: "6pt", color: "#64748b" }}>
                        Metodología: P × C = MR | Aceptable ≤ 14 | Moderado 15–24 | Substancial ≥ 25
                    </div>
                </div>

                {/* ─── TABLA DE CRITERIOS DE VALORIZACIÓN ─── */}
                <div style={{ marginTop: "10px", pageBreakInside: "avoid" }}>
                    <div style={{ fontSize: "8pt", fontWeight: "bold", color: "#2c4a72", marginBottom: "8px" }}>
                        CRITERIOS DE VALORIZACIÓN (P × C = MR)
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", border: "1px solid #c8d6e5" }}>
                        <thead>
                            <tr>
                                {['PROBABILIDAD (P)', 'CONSECUENCIA (C)', 'MAGNITUD DEL RIESGO (MR)'].map((h, i) => (
                                    <th key={i} style={{
                                        background: "#2c4a72", color: "#ffffff", padding: "6px 4px",
                                        textAlign: "center", verticalAlign: "middle", fontSize: "7.5pt", fontWeight: 800,
                                        border: "1px solid #c8d6e5", width: i === 0 ? "28%" : i === 1 ? "36%" : "36%"
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: "8px 6px", border: "1px solid #c8d6e5", verticalAlign: "top", textAlign: "center", fontSize: "7pt", color: "#334155", lineHeight: 1.5 }}>
                                    Baja (4)<br />Media (8)<br />Alta (12)
                                </td>
                                <td style={{ padding: "8px 6px", border: "1px solid #c8d6e5", verticalAlign: "top", textAlign: "center", fontSize: "7pt", color: "#334155", lineHeight: 1.5 }}>
                                    Ligeramente Dañino (1)<br />Dañino (2)<br />Extremadamente Dañino (3)
                                </td>
                                <td style={{ padding: "8px 6px", border: "1px solid #c8d6e5", verticalAlign: "top", textAlign: "center", fontSize: "7pt", color: "#334155", lineHeight: 1.5 }}>
                                    <div style={{ color: "#27ae60", fontWeight: "bold" }}>ACEPTABLE (≤ 14)</div>
                                    <div style={{ color: "#e67e22", fontWeight: "bold", margin: "2px 0" }}>MODERADO (15 - 24)</div>
                                    <div style={{ color: "#c0392b", fontWeight: "bold" }}>SUBSTANCIAL (≥ 25)</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div style={{ marginTop: '30px' }}>
                    <div className="pdf-footer">
                        <span>Wirin Ambiental</span>
                        <span>{CODE} | v{version} | {docDate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
