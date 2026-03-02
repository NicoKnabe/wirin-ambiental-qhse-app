"use client";

import { useState } from "react";
import Letterhead from "../Letterhead";
import { PPRData } from "../forms/PPRForm";
import SignatureUpload from "../SignatureUpload";

interface PPRPreviewProps { data: PPRData; }

// ─── Gantt data ──────────────────────────────────────────────────────────────
const ganttActivities = [
    { name: "AST (Análisis Seguro de Trabajo) Diario", marks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { name: "Charlas de 5 Minutos (Inicio de Jornada)", marks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { name: "Inspección de EPP y Herramientas", marks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { name: "Difusión y Firma de Procedimientos (PTS)", marks: [1, 3, 5, 7, 9, 11] },
    { name: "Actualización Matriz HIRA", marks: [3, 6, 9, 12] },
    { name: "Observaciones Planeadas de Seguridad", marks: [2, 4, 6, 8, 10, 12] },
    { name: "Inspección Planeada de Vehículos 4x4", marks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { name: "Capacitación en Primeros Auxilios", marks: [2, 8] },
    { name: "Capacitación Riesgos Radiación UV", marks: [1, 10] },
    { name: "Reunión de Seguridad Mensual", marks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { name: "Investigación de Incidentes (según ocurrencia)", marks: [] },
    { name: "Reporte de Estadísticas de Accidentabilidad", marks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { name: "Evaluación del Programa Preventivo", marks: [6, 12] },
    { name: "Auditoría Interna Preventiva", marks: [6, 12] },
];
const months = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

// ─── HIRA methodology tables ─────────────────────────────────────────────────
const hiraLikelihood = [
    { label: "ALTA (3)", desc: "El daño ocurrirá siempre o casi siempre. El peligro está presente continuamente durante el trabajo.", color: "#c62828" },
    { label: "MEDIA (2)", desc: "El daño ocurrirá algunas veces. El peligro está presente de forma no continua.", color: "#F57F17" },
    { label: "BAJA (1)", desc: "El daño ocurrirá raramente. El peligro está presente de forma ocasional o infrecuente.", color: "#2E7D32" },
];
const hiraSeverity = [
    { label: "GRAVE (3)", desc: "Lesiones o enfermedades graves / irreversibles, incapacidad permanente o muerte.", color: "#c62828" },
    { label: "MODERADO (2)", desc: "Lesiones con baja laboral temporal, recuperación posible.", color: "#F57F17" },
    { label: "LEVE (1)", desc: "Lesiones menores sin baja laboral (primeros auxilios).", color: "#2E7D32" },
];
const hiraRiskMatrix = [
    { risk: "ALTO", range: "MR ≥ 6", action: "Paralización inmediata. No iniciar actividad hasta resolver el riesgo.", bg: "#b71c1c", fg: "white" },
    { risk: "MEDIO", range: "MR = 4", action: "Implementar controles. Reducir el riesgo en plazo definido.", bg: "#e65100", fg: "white" },
    { risk: "BAJO", range: "MR ≤ 2–3", action: "Mantener controles actuales. Registrar y monitorear.", bg: "#2E7D32", fg: "white" },
];

// ─── SUSESO corrected text ────────────────────────────────────────────────────
const SUSESO_TEXT = `La Superintendencia de Seguridad Social, en el Compendio Normativo de la Ley 16.744, impartió instrucciones respecto de las obligaciones de las Entidades Empleadoras, instruyendo a los Organismos Administradores (Mutuales e ISL) y a las empresas con Administración Delegada, ante la ocurrencia de un Accidente Fatal o Grave que sufran los trabajadores de las entidades empleadoras adheridas o afiliadas. Esta guía tiene como objetivo orientar a las entidades empleadoras y a los trabajadores en el procedimiento y acciones que deben seguir en caso de accidentes graves o fatales, además de entregar conceptos que ayuden a identificar cuándo se trata de un accidente grave. Notificación Autoridad: Llamar al 600 42 000 22 (Línea de la Seremi de Salud e Inspección del Trabajo) para reportar accidentes graves o fatales.`;

// ─── Standardized footer ────────────────────────────────────────────────────
function DocFooter({ code, version, date, page, total }: { code: string; version: string; date: string; page: number; total: number }) {
    return (
        <div className="pdf-footer">
            <span>Wirin Ambiental</span>
            <span>{code} | v{version} | {date}</span>
        </div>
    );
}

export default function PPRPreview({ data }: PPRPreviewProps) {
    const P = data.projectName || "[Nombre del Proyecto]";
    const C = data.client || "[Mandante]";
    const year = data.year || "2026";
    const month = data.month || "Enero";
    const elab = data.elaboratedBy || "[Asesor SSO]";
    const rev = data.reviewedBy || "[Jefe de Proyecto]";
    const apr = data.approvedBy || "[Gerencia]";
    const elaboradoRole = data.elaboratedRole || "Experto en Prevención de Riesgos";
    const revisadoRole = data.reviewedRole || "Jefe de Proyecto";
    const aprobadoRole = data.approvedRole || "Gerencia Wirin Ambiental";
    const docDate = `${month} ${year}`;
    const CODE = "WA-PPR-001";
    const version = "1.0";

    const [sig1, setSig1] = useState<string | null>(null);
    const [sig2, setSig2] = useState<string | null>(null);
    const [sig3, setSig3] = useState<string | null>(null);

    return (
        <div id="ppr-preview" className="pdf-document">

            {/* ===== PAGE 1: Cover + Sections 1-4 ===== */}
            <div className="pdf-page">
                <Letterhead documentTitle="PROGRAMA DE PREVENCIÓN DE RIESGOS" docCode={CODE} version={version} date={docDate} currentPage={1} totalPages={4} />

                <div style={{ background: "linear-gradient(135deg, #1B5E20, #4CAF50)", borderRadius: "8px", padding: "22px 28px", marginBottom: "16px", color: "white" }}>
                    <div style={{ fontSize: "8pt", letterSpacing: "0.2em", opacity: 0.75, marginBottom: "4px", textTransform: "uppercase" }}>Programa Anual</div>
                    <div style={{ fontSize: "17pt", fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif" }}>Prevención de Riesgos</div>
                    <div style={{ fontSize: "9pt", opacity: 0.9, marginTop: "2px" }}>Proyecto: <strong>{P}</strong> — Mandante: <strong>{C}</strong></div>
                    <div style={{ fontSize: "8.5pt", opacity: 0.8, marginTop: "2px" }}>Período: {month} {year}</div>
                </div>

                {/* Header table — removed "Tasa Cotización Adicional" and "Marco Legal" */}
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", marginBottom: "12px" }}>
                    <tbody>
                        {[
                            ["Empresa", "Wirin Ambiental"],
                            ["Proyecto", P],
                            ["Mandante", C],
                            ["Período", `${month} ${year}`],
                        ].map(([k, v]) => (
                            <tr key={k}>
                                <td style={{ background: "#e8f5e9", fontWeight: 700, color: "#1B5E20", padding: "5px 10px", border: "1px solid #c8e6c9", width: "35%" }}>{k}</td>
                                <td style={{ padding: "5px 10px", border: "1px solid #c8e6c9" }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="pdf-section-title">1. Introducción</div>
                <div className="pdf-section-body">
                    El presente Programa de Prevención de Riesgos ha sido elaborado por <strong>Wirin Ambiental</strong> en cumplimiento de la normativa chilena vigente en materia de Seguridad y Salud Ocupacional, específicamente del <strong>Decreto Supremo N° 44 (2024)</strong>, el <strong>Decreto Supremo N° 76</strong>, la <strong>Ley N° 16.744</strong> de Accidentes del Trabajo, y las instrucciones de la <strong>SUSESO</strong> (Superintendencia de Seguridad Social).
                </div>
                <div className="pdf-section-body">
                    Este programa aplica para el proyecto <strong>{P}</strong>, bajo mandato de <strong>{C}</strong>, y está diseñado para asegurar condiciones de trabajo seguras y saludables para todos los trabajadores involucrados.
                </div>

                <div className="pdf-section-title">2. Alcance</div>
                <div className="pdf-section-body">
                    Este programa aplica a todos los trabajadores directos y subcontratistas de Wirin Ambiental que desarrollen actividades en el proyecto <strong>{P}</strong>, independiente del tipo de contrato, jornada laboral o especialidad.
                </div>

                <div className="pdf-section-title">3. Objetivos</div>
                <div className="pdf-section-body"><strong>3.1. Objetivo General:</strong> Prevenir los accidentes del trabajo y enfermedades profesionales en la ejecución del proyecto {P}, aplicando la gestión preventiva de riesgos de acuerdo al DS 44 (2024).</div>
                <table className="pdf-table" style={{ fontSize: "8.5pt" }}>
                    <thead><tr><th>Objetivo Específico</th><th style={{ width: "20%" }}>Meta</th><th style={{ width: "25%" }}>Indicador</th></tr></thead>
                    <tbody>
                        {[
                            ["Mantener Tasa de Frecuencia (TF) de accidentes en cero", "TF = 0", "N° acc. fatales o con JTP / HHT x 10⁶"],
                            ["Ejecutar el 100% de las actividades del Plan de Trabajo", "Cumpl. ≥ 90%", "Actividades realizadas / planificadas x 100"],
                            ["Cumplir con ODI y difusión de PTS al 100% del personal", "100%", "Registros firmados / trabajadores activos x 100"],
                            ["Cumplir obligación de capacitación mínima (DS 44 Art. 13)", "≥ 1h / trabajador / evento EPP", "Horas capacitación registradas"],
                        ].map(([obj, meta, ind]) => (
                            <tr key={obj}><td>{obj}</td><td style={{ textAlign: "center", fontWeight: 600, color: "#1B5E20" }}>{meta}</td><td style={{ fontSize: "7.5pt" }}>{ind}</td></tr>
                        ))}
                    </tbody>
                </table>

                <div className="pdf-section-title">4. Definiciones</div>
                <table className="pdf-table" style={{ fontSize: "8.5pt" }}>
                    <thead><tr><th style={{ width: "22%" }}>Término</th><th>Definición</th></tr></thead>
                    <tbody>
                        {[
                            ["Accidente del Trabajo", "Toda lesión sufrida a causa o con ocasión del trabajo (Art. 5° Ley 16.744)."],
                            ["Incidente", "Suceso que no produce lesión pero que podría haberla producido."],
                            ["Peligro", "Fuente o situación con potencial de daño en términos de lesión, enfermedad o daño al ambiente."],
                            ["Riesgo", "Combinación de la probabilidad y consecuencia de que ocurra un evento peligroso."],
                            ["HIRA", "Hazard Identification and Risk Assessment: metodología sistemática de identificación de peligros y evaluación de riesgos."],
                            ["ODI", "Obligación de Informar: derecho del trabajador a conocer los riesgos de su trabajo (DS 44 Art. 52)."],
                            ["PTS", "Procedimiento de Trabajo Seguro."],
                            ["EPP", "Elemento de Protección Personal. Proporcionado gratuitamente por el empleador (Art. 13 DS 44)."],
                        ].map(([t, d]) => (
                            <tr key={t}><td style={{ fontWeight: 600, color: "#1B5E20" }}>{t}</td><td>{d}</td></tr>
                        ))}
                    </tbody>
                </table>

                <DocFooter code={CODE} version={version} date={docDate} page={1} total={4} />
            </div>

            {/* ===== PAGE 2: Sections 5-8 ===== */}
            <div className="pdf-page">
                <Letterhead documentTitle="PROGRAMA DE PREVENCIÓN DE RIESGOS" docCode={CODE} version={version} date={docDate} currentPage={2} totalPages={4} />

                <div className="pdf-section-title">5. Política de Seguridad y Salud en el Trabajo</div>
                <div style={{ background: "#e8f5e9", border: "1px solid #c8e6c9", borderRadius: "6px", padding: "12px 16px", marginBottom: "12px", fontSize: "9pt", fontStyle: "italic" }}>
                    <p>Wirin Ambiental declara su compromiso con la prevención de accidentes del trabajo y enfermedades profesionales, protegiendo la vida e integridad física de sus trabajadores. La empresa implementará un Sistema de Gestión de SST conforme al <strong>DS 44 (2024)</strong>, cumpliendo todas las disposiciones legales vigentes y los estándares del mandante <strong>{C}</strong>.</p>
                    <p style={{ marginTop: "8px" }}>Todo accidente es evitable. La seguridad es una responsabilidad compartida entre la dirección, los supervisores y los trabajadores.</p>
                </div>

                <div className="pdf-section-title">6. Responsabilidades</div>
                <table className="pdf-table" style={{ fontSize: "8.5pt" }}>
                    <thead><tr><th style={{ width: "25%" }}>Rol</th><th>Responsabilidades Clave en Prevención</th></tr></thead>
                    <tbody>
                        {[
                            ["Gerencia Wirin Ambiental", "Asignar recursos humanos y económicos. Aprobar y firmar el Programa de Prevención. Revisar anualmente el desempeño del SGSST."],
                            ["Experto en Prevención de Riesgos (Asesor SSO)", "Elaborar, difundir y verificar el cumplimiento de este Programa. Mantener actualizada la Matriz HIRA. Gestionar estadísticas de accidentabilidad conforme DS 44 Art. 73."],
                            ["Jefe de Proyecto", `Asegurar la implementación en terreno. Autorizar el inicio de actividades solo con documentación SSO al día. Reportar a ${C}.`],
                            ["Trabajadores", "Cumplir los PTS y AST. Usar correctamente los EPP. Reportar incidentes y condiciones inseguras de inmediato."],
                        ].map(([r, d]) => (
                            <tr key={r}><td style={{ fontWeight: 600, color: "#1B5E20" }}>{r}</td><td>{d}</td></tr>
                        ))}
                    </tbody>
                </table>

                <div className="pdf-section-title">7. Elementos del Plan de Gestión Preventiva</div>
                <div className="pdf-section-body">Conforme al DS 44 (2024), los elementos fundamentales de gestión preventiva implementados son:</div>
                <table className="pdf-table" style={{ fontSize: "8.5pt" }}>
                    <thead><tr><th style={{ width: "35%" }}>Elemento</th><th>Descripción</th></tr></thead>
                    <tbody>
                        {[
                            ["Matriz HIRA", "Identificación sistemática (HIRA) de peligros y evaluación de riesgos por proceso y puesto de trabajo, con perspectiva de género."],
                            ["Programa de Prevención", "Objetivos, actividades, responsabilidades, recursos, cronograma y verificación."],
                            ["Obligación de Informar (ODI)", "Inducción formal que garantiza que cada trabajador conoce los riesgos específicos de su labor."],
                            ["Procedimientos de Trabajo Seguro (PTS)", "Descripción de pasos para ejecutar tareas críticas con controles de seguridad integrados."],
                            ["Gestión de EPP", "Entrega gratuita, capacitación mínima de 1 hora y registro formal de recepción."],
                            ["Estadísticas de Accidentabilidad", "Tasas de Frecuencia (TF) y Gravedad (TG) mensuales reportadas al mandante."],
                        ].map(([e, d]) => (
                            <tr key={e}><td style={{ fontWeight: 600 }}>{e}</td><td>{d}</td></tr>
                        ))}
                    </tbody>
                </table>

                <div className="pdf-section-title">8. Análisis de Gestión Preventiva</div>
                <div className="pdf-section-body">El análisis de gestión contempla la revisión trimestral de los siguientes indicadores de desempeño, reportados a {C} conforme al DS 76:</div>
                <table className="pdf-table" style={{ fontSize: "8.5pt" }}>
                    <thead><tr><th>Indicador</th><th style={{ width: "20%" }}>Fórmula</th><th style={{ width: "15%" }}>Meta</th><th style={{ width: "20%" }}>Frecuencia</th></tr></thead>
                    <tbody>
                        {[
                            ["Tasa de Frecuencia (TF)", "N° acc. x 10⁶ / HHT", "TF = 0", "Mensual"],
                            ["Tasa de Gravedad (TG)", "Días perdidos x 10⁶ / HHT", "TG = 0", "Mensual"],
                            ["% Cumplimiento del Plan", "Act. realizadas / planificadas x 100", "≥ 90%", "Mensual"],
                            ["Cobertura de ODI", "Trabajadores con ODI / total x 100", "100%", "Por ingreso"],
                        ].map(([i, f, m, fr]) => (
                            <tr key={i}><td style={{ fontWeight: 600 }}>{i}</td><td style={{ fontSize: "8pt" }}>{f}</td><td style={{ textAlign: "center", fontWeight: 600, color: "#1B5E20" }}>{m}</td><td style={{ textAlign: "center" }}>{fr}</td></tr>
                        ))}
                    </tbody>
                </table>

                <DocFooter code={CODE} version={version} date={docDate} page={2} total={4} />
            </div>

            {/* ===== PAGE 3: Gantt + Sections 9.6-9.7 ===== */}
            <div className="pdf-page" style={{ pageBreakBefore: "always" }}>
                <Letterhead documentTitle="PROGRAMA DE PREVENCIÓN DE RIESGOS" docCode={CODE} version={version} date={docDate} currentPage={3} totalPages={4} />

                <div className="pdf-section-title">9. Plan de Trabajo — Carta Gantt {year}</div>
                <div style={{ fontSize: "8pt", color: "#6b7280", marginBottom: "8px" }}>
                    Distribución anual de actividades de prevención para el proyecto {P}. Actualizado conforme DS 44 (2024).
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "7.5pt" }}>
                    <thead>
                        <tr>
                            <th style={{ background: "#1B5E20", color: "white", padding: "6px 8px", border: "1px solid #145214", textAlign: "left", width: "42%", textTransform: "uppercase", fontSize: "7pt", letterSpacing: "0.05em" }}>
                                Actividad de Prevención
                            </th>
                            {months.map((m, i) => (
                                <th key={i} style={{ background: "#1B5E20", color: "white", padding: "6px 4px", border: "1px solid #145214", textAlign: "center", width: "4.83%", fontSize: "7.5pt" }}>{m}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ganttActivities.map((act, rowIdx) => (
                            <tr key={rowIdx} style={{ background: rowIdx % 2 === 0 ? "#fff" : "#f0f7f0" }}>
                                <td style={{ padding: "5px 8px", border: "1px solid #c8e6c9", fontSize: "7.5pt" }}>{act.name}</td>
                                {months.map((_, colIdx) => {
                                    const marked = act.marks.includes(colIdx + 1);
                                    return (
                                        <td key={colIdx} style={{ border: "1px solid #c8e6c9", textAlign: "center", padding: "5px 2px" }}>
                                            {marked && (
                                                <div style={{ background: "#4CAF50", borderRadius: "3px", width: "100%", height: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <span style={{ color: "white", fontSize: "8pt", fontWeight: 700 }}>✓</span>
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="pdf-section-title" style={{ marginTop: "16px" }}>9.6. ACTUACIONES ANTE ACCIDENTE GRAVE O FATAL</div>
                <div className="pdf-section-body">
                    En caso de ocurrir un accidente grave o fatal (según lo definido en el Compendio Normativo de la SUSESO), se procederá inmediatamente así: 1. Suspender de forma inmediata las faenas en el área afectada y evacuar al personal si el riesgo persiste. 2. Prestar primeros auxilios y derivar al accidentado al centro asistencial más cercano. 3. Notificar de inmediato a la Autoridad llamando al 600 42 000 22 (Línea de la Seremi de Salud e Inspección del Trabajo). 4. Informar a la jefatura del mandante y aislar el sitio del suceso hasta que la autoridad competente autorice reanudar las labores.
                </div>

                <div className="pdf-section-title">9.7. Plan de Emergencias</div>
                <table className="pdf-table" style={{ fontSize: "8.5pt" }}>
                    <thead><tr><th style={{ width: "22%" }}>Tipo Emergencia</th><th>Procedimiento</th><th style={{ width: "18%" }}>Contacto</th></tr></thead>
                    <tbody>
                        {[
                            ["Accidente Laboral", "Evaluar al accidentado, activar primeros auxilios, llamar mutualidad, completar DIAT en 24h.", "ACHS: 600 600 2247"],
                            ["Accidente Grave/Fatal", "Suspender faena, no mover al accidentado, notificar SEREMI + Dirección del Trabajo.", "600 42 000 22"],
                            ["Incendio", "Activar alarma, evacuar, usar extintores solo si es seguro, llamar bomberos.", "Bomberos: 132"],
                            ["Emergencia Ambiental", `Contener derrame, aislar área, notificar a Jefatura y ${C} en máximo 60 min.`, `SOS ${C}`],
                        ].map(([t, p, c]) => (
                            <tr key={t}><td style={{ fontWeight: 600 }}>{t}</td><td style={{ fontSize: "8pt" }}>{p}</td><td style={{ fontWeight: 600, color: "#c62828", fontSize: "7.5pt" }}>{c}</td></tr>
                        ))}
                    </tbody>
                </table>

                <DocFooter code={CODE} version={version} date={docDate} page={3} total={4} />
            </div>

            {/* ===== PAGE 4: Section 10 — HIRA Methodology + Signatures ===== */}
            <div className="pdf-page" style={{ pageBreakBefore: "always" }}>
                <Letterhead documentTitle="PROGRAMA DE PREVENCIÓN DE RIESGOS" docCode={CODE} version={version} date={docDate} currentPage={4} totalPages={4} />

                {/* Section 10 — HIRA methodology (replaces old MIPER) */}
                <div className="pdf-section-title">10. Diagnóstico — Metodología HIRA (Hazard Identification and Risk Assessment)</div>
                <div className="pdf-section-body">
                    La evaluación de riesgos del proyecto <strong>{P}</strong> se realiza conforme al Art. 7 del DS 44 (2024), utilizando la metodología <strong>HIRA (Hazard Identification and Risk Assessment)</strong>. Esta metodología permite identificar sistemáticamente los peligros asociados a cada actividad y evaluar el nivel de riesgo resultante mediante la combinación de su <strong>Probabilidad (L)</strong> y su <strong>Severidad / Consecuencia (S)</strong>:
                </div>
                <div style={{ background: "#e8f5e9", border: "1px solid #c8e6c9", borderRadius: "6px", padding: "8px 14px", fontSize: "9pt", marginBottom: "10px" }}>
                    <strong>Nivel de Riesgo (MR) = Probabilidad (L) × Severidad (S)</strong>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    {/* Likelihood */}
                    <div>
                        <p style={{ fontSize: "8pt", fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", marginBottom: "4px" }}>Probabilidad (Likelihood)</p>
                        <table className="pdf-table" style={{ fontSize: "8pt" }}>
                            <thead><tr><th>Nivel</th><th>Criterio</th></tr></thead>
                            <tbody>
                                {hiraLikelihood.map(r => (
                                    <tr key={r.label}>
                                        <td style={{ fontWeight: 700, color: r.color, width: "28%" }}>{r.label}</td>
                                        <td style={{ fontSize: "7pt" }}>{r.desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Severity */}
                    <div>
                        <p style={{ fontSize: "8pt", fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", marginBottom: "4px" }}>Severidad (Severity)</p>
                        <table className="pdf-table" style={{ fontSize: "8pt" }}>
                            <thead><tr><th>Nivel</th><th>Criterio</th></tr></thead>
                            <tbody>
                                {hiraSeverity.map(r => (
                                    <tr key={r.label}>
                                        <td style={{ fontWeight: 700, color: r.color, width: "28%" }}>{r.label}</td>
                                        <td style={{ fontSize: "7pt" }}>{r.desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <p style={{ fontSize: "8pt", fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", marginBottom: "6px" }}>Clasificación del Riesgo HIRA (MR = L × S)</p>
                <table className="pdf-table" style={{ fontSize: "8.5pt", marginBottom: "16px" }}>
                    <thead><tr><th style={{ width: "15%" }}>Riesgo</th><th style={{ width: "15%" }}>Rango MR</th><th>Acción Requerida</th></tr></thead>
                    <tbody>
                        {hiraRiskMatrix.map(r => (
                            <tr key={r.risk}>
                                <td style={{ background: r.bg, color: r.fg, fontWeight: 700, textAlign: "center", padding: "6px 8px" }}>{r.risk}</td>
                                <td style={{ textAlign: "center", fontWeight: 700 }}>{r.range}</td>
                                <td>{r.action}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="pdf-section-body" style={{ marginBottom: "14px" }}>
                    Los resultados de la evaluación HIRA son registrados en la <strong>Matriz HIRA</strong> del proyecto {P}, la cual es actualizada trimestralmente o ante cualquier cambio en los procesos o condiciones de trabajo. La Matriz HIRA es el instrumento base que alimenta los PTS, la selección de EPP y el Plan de Capacitación.
                </div>

                {/* Signature Block */}
                <div style={{ borderTop: "2px solid #c8e6c9", paddingTop: "16px", marginTop: "16px" }}>
                    <p style={{ fontSize: "9pt", fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
                        Aprobación del Programa de Prevención
                    </p>
                    <div className="pdf-signature-box">
                        <SignatureUpload label="Elaboró" name={elab} role={elaboradoRole} signatureDataUrl={sig1} onSignatureChange={setSig1} />
                        <SignatureUpload label="Revisó" name={rev} role={revisadoRole} signatureDataUrl={sig2} onSignatureChange={setSig2} />
                        <SignatureUpload label="Aprobó" name={apr} role={aprobadoRole} signatureDataUrl={sig3} onSignatureChange={setSig3} />
                    </div>
                </div>

                <DocFooter code={CODE} version={version} date={docDate} page={4} total={4} />
            </div>
        </div>
    );
}
