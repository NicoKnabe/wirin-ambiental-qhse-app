"use client";

import { useState } from "react";
import Letterhead from "../Letterhead";
import { PTSData } from "../forms/PTSForm";
import SignatureUpload from "../SignatureUpload";

interface PTSPreviewProps { data: PTSData; }

function formatDate(dateStr: string): string {
    if (!dateStr) return "[Fecha]";
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
}
function fds(dateStr: string): string {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("es-CL");
}

// ─── Corrected EPP list (user-specified) ──────────────────────────────────────
const EPP_LISTA = [
    "Protector solar (FPS 30 o más)",
    "Gorro (ala ancha o legionario) en tela con filtro UV",
    "Camisa o polera manga larga con filtro UV",
    "Pantalón con filtro UV",
    "Lentes oscuros con filtro UV",
    "Zapatos de seguridad o trekking",
    "Chaleco reflectante",
    "Guantes de terreno",
    "Bálsamo labial fotoprotector",
];

// ─── Risk rows (sourced from HIRA data) ──────────────────────────────────────
const riskRows = [
    { actividad: "Desplazamiento en vehículo 4x4 por caminos rurales y de tierra", riesgo: "Accidente de tránsito / vuelco vehicular", consecuencia: "Lesiones graves, fracturas, muerte", medida: "Velocidad máxima 40 km/h en ripio. Revisión pre-operacional diaria. Conductor con licencia profesional. Cinturón obligatorio.", epp: "Cinturón de seguridad, calzado de seguridad", nivel: "Importante", color: "#FF6F00" },
    { actividad: "Caminatas en terreno agreste y ladera de cerros", riesgo: "Caída a distinto nivel / resbalón", consecuencia: "Esguinces, fracturas, TEC", medida: "Bastón de apoyo en pendientes. Zapatos con suela antideslizante. Nunca trabajar solo. Comunicar ruta al Jefe de Campo.", epp: "Zapatos de trekking certificados, guantes", nivel: "Moderado", color: "#2E7D32" },
    { actividad: "Exposición prolongada al sol durante monitoreos de terreno", riesgo: "Golpe de calor / quemaduras UV", consecuencia: "Deshidratación, insolación, quemaduras tipo II", medida: "Protector solar FPS 30+ cada 2 horas. Hidratación mínima 500ml/hora. Gorro ala ancha. Evitar exposición directa 11:00–15:00 h.", epp: "Gorro legionario, manga larga UV, bloqueador FPS 30+, lentes UV", nivel: "Moderado", color: "#2E7D32" },
    { actividad: "Manejo / captura de fauna silvestre", riesgo: "Mordedura / arañazo de animal silvestre", consecuencia: "Heridas, riesgo de infección, rabia", medida: "Guantes de cuero reforzados. Protocolo de manipulación certificado. Vacunación antirrábica al día. Solo personal capacitado.", epp: "Guantes de terreno, manga larga, kit de primeros auxilios", nivel: "Moderado", color: "#2E7D32" },
    { actividad: "Trabajo en zonas remotas sin cobertura celular", riesgo: "Incomunicación ante emergencia", consecuencia: "Retraso en asistencia médica", medida: "Radio VHF o GPS satelital obligatorio. Check-in horario con central. Plan de emergencia activo antes del inicio.", epp: "Radio VHF, teléfono satelital (según zona)", nivel: "Tolerable", color: "#F57F17" },
    { actividad: "Uso prolongado de binoculares y equipos ópticos", riesgo: "Fatiga visual / TME cervical", consecuencia: "Dolor cervical, fatiga ocular", medida: "Pausas activas 5 min cada hora. Rotación de tareas. Postura ergonómica.", epp: "Protector solar, postura activa", nivel: "Tolerable", color: "#F57F17" },
];

// ─── Standardized footer ────────────────────────────────────────────────────
function DocFooter({ code, version, date, page, total }: { code: string; version: string; date: string; page: number; total: number }) {
    return (
        <div className="pdf-footer">
            <span>Wirin Ambiental</span>
            <span>{code} | v{version} | {date}</span>
        </div>
    );
}

// ─── Editable diffusion table row ────────────────────────────────────────────
interface DiffRow { nombre: string; rut: string; cargo: string; fecha: string; sigUrl: string | null; }

export default function PTSPreview({ data }: PTSPreviewProps) {
    const P = data.projectName || "[Nombre del Proyecto]";
    const C = data.client || "[Mandante]";
    const L = data.location || "[Ubicación]";
    const R = data.region || "[Región]";
    const PM = data.projectManager || "[Nombre del Jefe de Proyecto]";
    const SSO = data.ssoAdvisor || "[Nombre del Asesor SSO]";
    const version = data.version || "1.0";
    const docDate = fds(data.startDate) || new Date().toLocaleDateString("es-CL");
    const CODE = "WA-PTS-001";

    // Aprobación signatures
    const [sig1, setSig1] = useState<string | null>(null);
    const [sig2, setSig2] = useState<string | null>(null);
    const [sig3, setSig3] = useState<string | null>(null);

    // Editable diffusion table
    const blankRow = (): DiffRow => ({ nombre: "", rut: "", cargo: "", fecha: docDate, sigUrl: null });
    const [diffRows, setDiffRows] = useState<DiffRow[]>(Array.from({ length: 8 }, blankRow));

    const updateRow = (i: number, field: keyof DiffRow, val: string | null) => {
        setDiffRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
    };
    const addRow = () => setDiffRows(prev => [...prev, blankRow()]);
    const removeRow = (i: number) => setDiffRows(prev => prev.filter((_, idx) => idx !== i));

    return (
        <div id="pts-preview" className="pdf-document">
            {/* PAGE 1 */}
            <div className="pdf-page">
                <Letterhead documentTitle="PROCEDIMIENTO DE TRABAJO SEGURO — MONITOREO DE FLORA Y FAUNA" docCode={CODE} version={version} date={docDate} currentPage={1} totalPages={3} />

                <div style={{ background: "linear-gradient(135deg, #0d3b1e 0%, #1B5E20 60%, #2E7D32 100%)", borderRadius: "8px", padding: "20px 28px", marginBottom: "16px", color: "white" }}>
                    <div style={{ fontSize: "8pt", letterSpacing: "0.2em", opacity: 0.7, marginBottom: "4px", textTransform: "uppercase" }}>Procedimiento de Trabajo Seguro</div>
                    <div style={{ fontSize: "16pt", fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif" }}>Monitoreo de Flora y Fauna</div>
                    <div style={{ fontSize: "9pt", opacity: 0.85, marginTop: "4px" }}>Proyecto: <strong>{P}</strong> — Mandante: <strong>{C}</strong></div>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", marginBottom: "12px" }}>
                    <tbody>
                        {[["Código", CODE], ["Proyecto", P], ["Mandante", C], ["Ubicación", `${L}${R ? ", Región de " + R : ""}`], ["Fecha Inicio", formatDate(data.startDate)], ["Jefe de Proyecto", PM], ["Asesor SSO", SSO]].map(([k, v]) => (
                            <tr key={k}><td style={{ background: "#e8f5e9", fontWeight: 700, color: "#1B5E20", padding: "4px 8px", border: "1px solid #c8e6c9", width: "30%" }}>{k}</td><td style={{ padding: "4px 8px", border: "1px solid #c8e6c9" }}>{v}</td></tr>
                        ))}
                    </tbody>
                </table>

                <div className="pdf-section-title">1. Objetivo y Alcance</div>
                <div className="pdf-section-body">Establecer los controles de seguridad para la ejecución del monitoreo de flora y fauna en el proyecto <strong>{P}</strong>, garantizando la integridad física de los trabajadores, el cumplimiento de la normativa (Ley 16.744, DS 44) y los estándares de <strong>{C}</strong>.</div>

                <div className="pdf-section-title">2. Responsabilidades</div>
                <table className="pdf-table">
                    <thead><tr><th style={{ width: "30%" }}>Cargo</th><th>Responsabilidades</th></tr></thead>
                    <tbody>
                        <tr><td style={{ fontWeight: 600 }}>Asesor SSO<br /><span style={{ fontWeight: 400, fontSize: "7.5pt" }}>{SSO}</span></td><td>Difundir y verificar cumplimiento de este PTS. Supervisar uso de EPP. Investigar cualquier incidente.</td></tr>
                        <tr><td style={{ fontWeight: 600 }}>Jefe de Proyecto<br /><span style={{ fontWeight: 400, fontSize: "7.5pt" }}>{PM}</span></td><td>Proveer los recursos necesarios. Validar condiciones de seguridad antes de iniciar labores. Reportar a {C}.</td></tr>
                        <tr><td style={{ fontWeight: 600 }}>Especialistas de Campo</td><td>Cumplir estrictamente este PTS. Usar EPP asignado. Reportar condiciones inseguras de inmediato.</td></tr>
                    </tbody>
                </table>

                {/* Section 3: EPP — corrected list */}
                <div className="pdf-section-title">3. EPP Requerido</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "9pt", marginBottom: "12px" }}>
                    {EPP_LISTA.map((item) => (
                        <div key={item} style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
                            <span style={{ color: "#4CAF50", fontWeight: 700, fontSize: "10pt", lineHeight: "1.3" }}>✓</span>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>

                <DocFooter code={CODE} version={version} date={docDate} page={1} total={3} />
            </div>

            {/* PAGE 2 — Risk Table + Procedure (corrected sections 6.1, 6.2, 6.2.1) */}
            <div className="pdf-page">
                <Letterhead documentTitle="PROCEDIMIENTO DE TRABAJO SEGURO — MONITOREO DE FLORA Y FAUNA" docCode={CODE} version={version} date={docDate} currentPage={2} totalPages={3} />

                <div className="pdf-section-title">4. Riesgos, Consecuencias y Medidas de Control</div>
                <div style={{ fontSize: "8pt", color: "#6b7280", marginBottom: "6px" }}>Datos sincronizados desde la Matriz HIRA del proyecto {P}.</div>
                <table className="pdf-table" style={{ fontSize: "8pt" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "18%" }}>Actividad</th>
                            <th style={{ width: "16%" }}>Riesgo Identificado</th>
                            <th style={{ width: "13%" }}>Consecuencia</th>
                            <th style={{ width: "30%" }}>Medida Preventiva / Control</th>
                            <th style={{ width: "14%" }}>EPP Requerido</th>
                            <th style={{ width: "9%" }}>Nivel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {riskRows.map((row, i) => (
                            <tr key={i}>
                                <td style={{ fontWeight: 600, fontSize: "7.5pt" }}>{row.actividad}</td>
                                <td style={{ color: "#c62828", fontSize: "7.5pt" }}>{row.riesgo}</td>
                                <td style={{ fontSize: "7.5pt" }}>{row.consecuencia}</td>
                                <td style={{ fontSize: "7.5pt" }}>{row.medida}</td>
                                <td style={{ fontSize: "7pt" }}>{row.epp}</td>
                                <td style={{ textAlign: "center" }}>
                                    <span style={{ background: row.color, color: "white", borderRadius: "4px", padding: "2px 4px", fontSize: "7pt", fontWeight: 700, display: "block" }}>{row.nivel}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Procedure: corrected to 6.1 / 6.2 / 6.2.1 structure as specified */}
                <div className="pdf-section-title" style={{ marginTop: "14px" }}>5. Descripción del Proceso</div>

                <div className="font-bold text-[#1B5E20] mb-2 mt-4 text-[9pt]">6.1. Etapa de Gabinete (Pre-terreno)</div>
                <div className="pdf-section-body mb-4">
                    <p className="mb-2">Previo al trabajo en terreno se realizan las siguientes actividades:</p>
                    <ul className="list-disc ml-6 mb-2 space-y-2">
                        <li>Revisión cartográfica del sector y verificación de condiciones climáticas.</li>
                        <li>Gestión de permisos de acceso predial y coordinación con propietarios.</li>
                        <li>Diseño del plan de muestreo (parcelas de flora, transectos de fauna, puntos de escucha).</li>
                        <li>Revisión y programación de cámaras trampa (trap cameras): verificación de baterías, memoria SD, configuración de disparo y fecha/hora.</li>
                        <li>Preparación de equipos de playback para monitoreo de fauna de interés (aves, mamíferos).</li>
                        <li>Confirmación del plan de emergencia activo y verificación de comunicaciones.</li>
                    </ul>
                </div>

                <div className="font-bold text-[#1B5E20] mb-2 text-[9pt]">6.2. Ejecución de la Actividad en Terreno</div>
                <div className="pdf-section-body mb-4">
                    <ul className="list-disc ml-6 mb-2 space-y-2">
                        <li>Realización del AST (Análisis Seguro de Trabajo) diario, firmado por todos los integrantes de la cuadrilla antes de iniciar labores.</li>
                        <li>Verificación del uso correcto de EPP: protector solar FPS 30+, gorro legionario UV, camisa y pantalón manga larga UV, lentes oscuros UV, zapatos de seguridad o trekking, chaleco reflectante, guantes de terreno y bálsamo labial.</li>
                        <li>Inspección pre-operacional del vehículo 4x4 (checklist estándar); velocidad máxima 40 km/h en caminos de ripio.</li>
                        <li>Revisión y recogida de cámaras trampa instaladas en estaciones previas; registro de imágenes y reposición de consumibles (baterías, SD).</li>
                        <li>Registro de avistamientos directos e indirectos (huellas, madrigueras, vocalizaciones).</li>
                        <li>Check-in horario con central por radio VHF o teléfono satelital en zonas sin cobertura.</li>
                    </ul>
                </div>

                <div className="font-bold text-[#1B5E20] mb-2 text-[9pt]">6.2.1. Metodología de Monitoreo</div>
                <div className="pdf-section-body mb-4">
                    <ul className="list-disc ml-6 mb-2 space-y-2">
                        <li><strong>Flora:</strong> Parcelas de muestreo según protocolo RCA o IBA. Registro de especie, cobertura vegetal, estado de conservación y georreferenciación GPS de cada punto.</li>
                        <li><strong>Fauna terrestre:</strong> Instalación y revisión de cámaras trampa en estaciones fijas. Transectos de registro diurno y nocturno.</li>
                        <li><strong>Fauna aviar:</strong> Uso de técnica de playback (reproducción de cantos o llamadas) para detectar presencia de especies elusivas. El playback se aplica con protocolo que evita el acoso o alteración conductual significativa de la fauna.</li>
                        <li><strong>Mamíferos:</strong> Detectoreo ultrasónico para quirópteros. Registro de vocalizaciones mediante grabador bioacústico.</li>
                        <li>Al término del día: retiro de todos los equipos y residuos, registro fotográfico con coordenadas, completar planillas de campo y reportar al Jefe de Proyecto.</li>
                    </ul>
                </div>

                <DocFooter code={CODE} version={version} date={docDate} page={2} total={3} />
            </div>

            {/* PAGE 3 — Signatures + Editable Diffusion Table */}
            <div className="pdf-page">
                <Letterhead documentTitle="PROCEDIMIENTO DE TRABAJO SEGURO — MONITOREO DE FLORA Y FAUNA" docCode={CODE} version={version} date={docDate} currentPage={3} totalPages={3} />

                {/* Approval signatures */}
                <div className="pdf-section-title">6. Aprobación del Procedimiento</div>
                <div className="pdf-signature-box">
                    <SignatureUpload label="Elaboró" name={data.elaboratedBy || SSO} role={data.elaboratedByRole || "Asesor SSO"} signatureDataUrl={sig1} onSignatureChange={setSig1} />
                    <SignatureUpload label="Revisó" name={data.reviewedBy || PM} role={data.reviewedByRole || "Jefe de Proyecto"} signatureDataUrl={sig2} onSignatureChange={setSig2} />
                    <SignatureUpload label="Aprobó" name={data.approvedBy || "Dirección General"} role={data.approvedByRole || "Gerencia Wirin Ambiental"} signatureDataUrl={sig3} onSignatureChange={setSig3} />
                </div>

                {/* Editable diffusion table */}
                <div className="pdf-section-title" style={{ marginTop: "18px" }}>7. Registro de Difusión — Firma de Trabajadores</div>
                <div style={{ fontSize: "8.5pt", color: "#6b7280", marginBottom: "8px" }}>
                    Acredito haber recibido, leído y comprendido el presente Procedimiento de Trabajo Seguro, comprometiéndome a su cumplimiento estricto.
                </div>

                {/* Editable table */}
                <table className="pdf-table" style={{ fontSize: "8pt" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "4%" }}>N°</th>
                            <th style={{ width: "28%" }}>Nombre Completo</th>
                            <th style={{ width: "16%" }}>RUT</th>
                            <th style={{ width: "18%" }}>Cargo</th>
                            <th style={{ width: "12%" }}>Fecha</th>
                            <th>Firma Digital</th>
                        </tr>
                    </thead>
                    <tbody>
                        {diffRows.map((row, i) => (
                            <tr key={i} style={{ height: "44px" }}>
                                <td style={{ textAlign: "center", color: "#9e9e9e", verticalAlign: "middle" }}>{i + 1}</td>
                                <td style={{ padding: "2px 4px", verticalAlign: "middle" }}>
                                    <input
                                        value={row.nombre}
                                        onChange={e => updateRow(i, "nombre", e.target.value)}
                                        placeholder="Nombre completo"
                                        style={{ width: "100%", border: "none", borderBottom: "1px solid #e0e0e0", fontSize: "8pt", padding: "2px 0", outline: "none", background: "transparent" }}
                                    />
                                </td>
                                <td style={{ padding: "2px 4px", verticalAlign: "middle" }}>
                                    <input
                                        value={row.rut}
                                        onChange={e => updateRow(i, "rut", e.target.value)}
                                        placeholder="12.345.678-9"
                                        style={{ width: "100%", border: "none", borderBottom: "1px solid #e0e0e0", fontSize: "8pt", padding: "2px 0", outline: "none", background: "transparent" }}
                                    />
                                </td>
                                <td style={{ padding: "2px 4px", verticalAlign: "middle" }}>
                                    <input
                                        value={row.cargo}
                                        onChange={e => updateRow(i, "cargo", e.target.value)}
                                        placeholder="Especialidad"
                                        style={{ width: "100%", border: "none", borderBottom: "1px solid #e0e0e0", fontSize: "8pt", padding: "2px 0", outline: "none", background: "transparent" }}
                                    />
                                </td>
                                <td style={{ padding: "2px 4px", verticalAlign: "middle" }}>
                                    <input
                                        value={row.fecha}
                                        onChange={e => updateRow(i, "fecha", e.target.value)}
                                        style={{ width: "100%", border: "none", borderBottom: "1px solid #e0e0e0", fontSize: "8pt", padding: "2px 0", outline: "none", background: "transparent" }}
                                    />
                                </td>
                                <td style={{ padding: "2px 4px", verticalAlign: "middle" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        <SignatureUpload
                                            name="" role=""
                                            signatureDataUrl={row.sigUrl}
                                            onSignatureChange={url => updateRow(i, "sigUrl", url)}
                                            small
                                        />
                                        <button
                                            onClick={() => removeRow(i)}
                                            title="Eliminar fila"
                                            style={{ background: "none", border: "none", color: "#e57373", cursor: "pointer", fontSize: "10pt", padding: "0 2px", flexShrink: 0 }}
                                        >✕</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Add row button */}
                <button
                    onClick={addRow}
                    style={{ marginTop: "8px", fontSize: "8pt", color: "#1B5E20", background: "#f0fdf4", border: "1px dashed #4CAF50", borderRadius: "4px", padding: "5px 14px", cursor: "pointer", display: "block" }}
                >
                    + Agregar trabajador
                </button>

                <DocFooter code={CODE} version={version} date={docDate} page={3} total={3} />
            </div>
        </div>
    );
}
