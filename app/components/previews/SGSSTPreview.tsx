"use client";

import { useState } from "react";
import Letterhead from "../Letterhead";
import { SGSSTData } from "../forms/SGSSTForm";
import SignatureUpload from "../SignatureUpload";

interface SGSSTPreviewProps { data: SGSSTData; }

function formatDate(dateStr: string): string {
    if (!dateStr) return "[Fecha]";
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
}
function formatDateShort(dateStr: string): string {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("es-CL");
}

// ─── Corrección normativa aprobada ───────────────────────────────────────────
const ACCIDENTE_GRAVE_FATAL_TEXT = `La Superintendencia de Seguridad Social, en el Compendio Normativo de la Ley 16.744, impartió instrucciones respecto de las obligaciones de las Entidades Empleadoras, instruyendo a los Organismos Administradores (Mutuales e ISL) y a las empresas con Administración Delegada, ante la ocurrencia de un Accidente Fatal o Grave que sufran los trabajadores de las entidades empleadoras adheridas o afiliadas. Esta guía tiene como objetivo orientar a las entidades empleadoras y a los trabajadores en el procedimiento y acciones que deben seguir en caso de accidentes graves o fatales, además de entregar conceptos que ayuden a identificar cuándo se trata de un accidente grave. Notificación Autoridad: Llamar al 600 42 000 22 (Línea de la Seremi de Salud e Inspección del Trabajo) para reportar accidentes graves o fatales.`;

// ─── Shared footer ────────────────────────────────────────────────────────────
function DocFooter({ code, version, date, page, total }: { code: string; version: string; date: string; page: number; total: number }) {
    return (
        <div className="pdf-footer">
            <span>Wirin Ambiental</span>
            <span>{code} | v{version} | {date}</span>
        </div>
    );
}

export default function SGSSTPreview({ data }: SGSSTPreviewProps) {
    const P = data.projectName || "[Nombre del Proyecto]";
    const C = data.client || "[Nombre del Mandante]";
    const L = data.location || "[Ubicación]";
    const R = data.region || "[Región]";
    const PM = data.projectManager || "[Nombre del Jefe de Proyecto]";
    const SSO = data.ssoAdvisor || "[Nombre del Asesor SSO]";
    const RUT = data.companyRut || "[RUT Empresa]";
    const startDate = formatDate(data.startDate);
    const endDate = formatDate(data.endDate);
    const version = data.version || "1.0";
    const docDate = formatDateShort(data.startDate) || new Date().toLocaleDateString("es-CL");
    const CODE = "WA-SGSST-001";

    // Signature images state
    const [sig1, setSig1] = useState<string | null>(null);
    const [sig2, setSig2] = useState<string | null>(null);
    const [sig3, setSig3] = useState<string | null>(null);

    return (
        <div id="sgsst-preview" className="pdf-document">
            {/* PAGE 1: Cover + Sections 1-4 */}
            <div className="pdf-page">
                <Letterhead
                    documentTitle="MANUAL DEL SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO"
                    docCode={CODE} version={version} date={docDate} currentPage={1} totalPages={3}
                />

                {/* Cover Block */}
                <div style={{ background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 60%, #4CAF50 100%)", borderRadius: "8px", padding: "28px 32px", marginBottom: "20px", color: "white" }}>
                    <div style={{ fontSize: "9pt", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.8, marginBottom: "6px" }}>Documento Oficial</div>
                    <div style={{ fontSize: "18pt", fontWeight: 700, fontFamily: "'Roboto Condensed', sans-serif", marginBottom: "4px" }}>Manual SGSST</div>
                    <div style={{ fontSize: "10pt", opacity: 0.9 }}>Sistema de Gestión de Seguridad y Salud en el Trabajo</div>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9.5pt", marginBottom: "18px" }}>
                    <tbody>
                        {[
                            ["Empresa Contratista", "Wirin Ambiental"],
                            ["Proyecto", P],
                            ["Mandante", C],
                            ["Ubicación", `${L}${R ? ", Región de " + R : ""}`],
                            ["Fecha de Emisión", docDate],
                            ["Vigencia", `${startDate} al ${endDate}`],
                            ["RUT Empresa", RUT],
                            ["Versión", version],
                        ].map(([k, v]) => (
                            <tr key={k}>
                                <td style={{ background: "#e8f5e9", fontWeight: 700, color: "#1B5E20", padding: "5px 10px", border: "1px solid #c8e6c9", width: "35%" }}>{k}</td>
                                <td style={{ padding: "5px 10px", border: "1px solid #c8e6c9", color: "#1f2937" }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="pdf-section-title">1. Objetivo y Alcance</div>
                <div className="pdf-section-body"><strong>1.1. Objetivo:</strong> Establecer las directrices, responsabilidades y procedimientos para proteger la vida, integridad física y salud ocupacional de todos los trabajadores de Wirin Ambiental durante la ejecución de los servicios de monitoreo ambiental en el proyecto <strong>{P}</strong>.</div>
                <div className="pdf-section-body"><strong>1.2. Alcance:</strong> Este manual es de cumplimiento obligatorio para todo el personal directo y subcontratistas que participen en el proyecto <strong>{P}</strong>, operando bajo los estándares de <strong>{C}</strong> y la normativa legal chilena vigente.</div>

                <div className="pdf-section-title">2. Liderazgo y Política de Seguridad y Salud</div>
                <div className="pdf-section-body">La Alta Dirección de Wirin Ambiental se compromete formalmente a proporcionar condiciones de trabajo seguras y saludables, eliminar los peligros y reducir los riesgos para la SSO.</div>
                <div className="pdf-section-body">Se adjunta a este manual la Política de Seguridad, Salud Ocupacional y Medio Ambiente firmada por <strong>{PM}</strong>, en su calidad de Jefe de Proyecto, la cual es difundida a todos los trabajadores antes del inicio de sus labores.</div>

                <div className="pdf-section-title">3. Marco Legal y Normativo</div>
                <div className="pdf-section-body">Este SGSST se fundamenta y da cumplimiento a las siguientes normativas:</div>
                <table className="pdf-table">
                    <thead><tr><th style={{ width: "30%" }}>Normativa</th><th>Descripción</th></tr></thead>
                    <tbody>
                        {[
                            ["Ley N° 16.744", "Seguros contra Riesgos de Accidentes del Trabajo y Enfermedades Profesionales. Establece las obligaciones del empleador y derechos del trabajador."],
                            ["Decreto Supremo N° 44 (2024)", "Reglamento sobre Gestión Preventiva de los Riesgos Laborales. Reemplaza DS 40 y DS 54. Vigencia: 27/07/2025."],
                            ["Decreto Supremo N° 76", "Reglamento para la aplicación del Art. 66 bis Ley 16.744 sobre gestión de la SST en faenas contratistas."],
                            ["Ley N° 20.123", "Regula el trabajo en régimen de subcontratación y las obligaciones del mandante."],
                            ["Decreto Supremo N° 594", "Reglamento sobre Condiciones Sanitarias y Ambientales Básicas en los Lugares de Trabajo."],
                            [`Reglamentos de ${C}`, `Estándares internos del mandante ${C}. Prevaleciendo siempre la norma más exigente.`],
                        ].map(([n, d]) => (
                            <tr key={n}><td style={{ fontWeight: 600, color: "#1B5E20" }}>{n}</td><td>{d}</td></tr>
                        ))}
                    </tbody>
                </table>

                <div className="pdf-section-title">4. Planificación y Gestión de Riesgos</div>
                <div className="pdf-section-body"><strong>4.1. Identificación de Peligros y Evaluación de Riesgos (IPER):</strong> Previo al inicio de los trabajos en terreno, se elabora la Matriz HIRA específica para el proyecto <strong>{P}</strong>, conforme a los requisitos del Art. 7 del DS 44.</div>
                <div className="pdf-section-body"><strong>4.2. Jerarquía de Controles:</strong> Toda medida preventiva priorizará la eliminación del riesgo. De no ser posible, se aplicarán controles de ingeniería, señalización, advertencia, controles administrativos y, como última barrera, el uso de Elementos de Protección Personal (EPP).</div>

                <DocFooter code={CODE} version={version} date={docDate} page={1} total={3} />
            </div>

            {/* PAGE 2: Sections 5-8 */}
            <div className="pdf-page">
                <Letterhead documentTitle="MANUAL DEL SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO" docCode={CODE} version={version} date={docDate} currentPage={2} totalPages={3} />

                <div className="pdf-section-title">5. Estructura y Responsabilidades</div>
                <table className="pdf-table">
                    <thead><tr><th style={{ width: "30%" }}>Cargo / Rol</th><th>Responsabilidades SSO</th></tr></thead>
                    <tbody>
                        <tr>
                            <td style={{ fontWeight: 600, color: "#1B5E20" }}>Jefe de Proyecto<br /><span style={{ fontWeight: 400, fontSize: "8pt" }}>{PM}</span></td>
                            <td>Responsable máximo de proveer los recursos necesarios y asegurar la implementación de este SGSST en terreno. Firma el Plan de Emergencia y la Política de SSO. Reporta a {C}.</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 600, color: "#1B5E20" }}>Asesor SSO<br /><span style={{ fontWeight: 400, fontSize: "8pt" }}>{SSO}</span></td>
                            <td>Encargado de asesorar técnica y legalmente en materia de prevención, verificar el cumplimiento de normativas (DS 44, Ley 16.744), gestionar la documentación frente al mandante {C}, y mantener actualizada la Matriz HIRA.</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 600, color: "#1B5E20" }}>Trabajadores / Especialistas</td>
                            <td>Obligados a cumplir los Procedimientos de Trabajo Seguro (PTS), utilizar correctamente sus EPP y reportar inmediatamente cualquier condición insegura al Asesor SSO o Jefe de Proyecto.</td>
                        </tr>
                    </tbody>
                </table>

                <div className="pdf-section-title">6. Competencia, Formación y Toma de Conciencia</div>
                <div className="pdf-section-body">Todo trabajador que ingrese al proyecto <strong>{P}</strong> en <strong>{L}</strong> deberá contar con:</div>
                <table className="pdf-table">
                    <thead><tr><th>Requisito</th><th>Descripción</th><th style={{ width: "20%" }}>Responsable</th></tr></thead>
                    <tbody>
                        {[
                            ["Obligación de Informar (ODI/DAS)", "Registro firmado que acredite la inducción sobre los riesgos específicos de su labor, conforme al Art. 52 DS 44.", SSO],
                            ["Exámenes Pre-ocupacionales", "Vigentes y validados por la mutualidad (ACHS / ISL / Mutual de Seguridad).", PM],
                            ["Capacitación en Riesgos Específicos", "Uso de extintores, conducción en terrenos rurales, primeros auxilios básicos, protocolo de radiación UV.", SSO],
                            ["Inducción Mandante", `Charla de inducción del sistema de gestión de ${C} antes del primer ingreso a la faena.`, PM],
                        ].map(([r, d, res]) => (
                            <tr key={r}><td style={{ fontWeight: 600 }}>{r}</td><td>{d}</td><td style={{ textAlign: "center", fontSize: "8pt" }}>{res}</td></tr>
                        ))}
                    </tbody>
                </table>

                <div className="pdf-section-title">7. Comunicación y Participación</div>
                <div className="pdf-section-body">Se establecen canales formales para el reporte de incidentes y condiciones inseguras. La comunicación oficial con <strong>{C}</strong> será canalizada exclusivamente a través del Jefe de Proyecto <strong>{PM}</strong> y/o Asesor SSO <strong>{SSO}</strong>.</div>

                <div className="pdf-section-title">8. Control Operacional</div>
                <div className="pdf-section-body">Para garantizar la seguridad en terreno, se implementarán los siguientes controles críticos:</div>
                <table className="pdf-table">
                    <thead><tr><th style={{ width: "30%" }}>Control</th><th>Descripción</th><th style={{ width: "20%" }}>Frecuencia</th></tr></thead>
                    <tbody>
                        {[
                            ["Procedimientos de Trabajo Seguro (PTS)", "Ninguna tarea crítica se ejecutará sin su respectivo PTS difundido y firmado por todos los trabajadores involucrados.", "Por actividad"],
                            ["Análisis Seguro de Trabajo (AST)", "Documento diario que cada cuadrilla debe rellenar y firmar antes de iniciar su jornada.", "Diario"],
                            ["Inspección de EPP", "Verificación del estado y uso correcto de todos los elementos de protección personal.", "Diario"],
                            ["Checklist Vehículos 4x4", "Inspección pre-operacional de vehículos de terreno según lista de verificación estándar.", "Diario"],
                            ["Gestión Salud Ocupacional", "Cumplimiento de protocolos MINSAL: Radiación UV, Trastornos Musculoesqueléticos (TMERT), Factores Psicosociales.", "Mensual"],
                        ].map(([r, d, f]) => (
                            <tr key={r}><td style={{ fontWeight: 600 }}>{r}</td><td>{d}</td><td style={{ textAlign: "center", fontSize: "8.5pt", color: "#1B5E20", fontWeight: 600 }}>{f}</td></tr>
                        ))}
                    </tbody>
                </table>

                <DocFooter code={CODE} version={version} date={docDate} page={2} total={3} />
            </div>

            {/* PAGE 3: Sections 9-12 + Signatures */}
            <div className="pdf-page">
                <Letterhead documentTitle="MANUAL DEL SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO" docCode={CODE} version={version} date={docDate} currentPage={3} totalPages={3} />

                <div className="pdf-section-title">9. Preparación y Respuesta ante Emergencias</div>
                <div className="pdf-section-body">Se mantendrá un Plan de Emergencia Local ajustado a la geografía de <strong>{L}{R ? ", Región de " + R : ""}</strong>. En caso de accidente, se activará la derivación inmediata al centro de salud de la mutualidad en convenio más cercano.</div>
                <table className="pdf-table">
                    <thead><tr><th>Tipo de Emergencia</th><th>Acción Inmediata</th><th style={{ width: "25%" }}>Contacto</th></tr></thead>
                    <tbody>
                        {[
                            ["Accidente con lesión", "Prestar primeros auxilios, llamar a Mutualidad, completar formulario DIAT dentro de 24h.", "Fono ACHS: 600 600 2247"],
                            ["Accidente Grave o Fatal", "Suspender faena. No mover al accidentado sin indicación médica. Notificar SEREMI y Dirección del Trabajo.", "600 42 000 22"],
                            ["Incendio / Explosión", "Evacuar el área, activar extintor si es seguro, alertar a Bomberos.", "Fono Bomberos: 132"],
                            ["Emergencia Ambiental", `Contener derrame, aislar área, reportar a Jefatura y a ${C} en máximo 1 hora.`, `Contraparte ${C}`],
                        ].map(([t, a, c]) => (
                            <tr key={t}><td style={{ fontWeight: 600 }}>{t}</td><td style={{ fontSize: "8.5pt" }}>{a}</td><td style={{ fontSize: "8pt", color: "#1B5E20", fontWeight: 600 }}>{c}</td></tr>
                        ))}
                    </tbody>
                </table>

                <div className="page-break"></div>
                <div className="pdf-section-title">10. Seguimiento, Medición y Auditoría</div>
                <div className="pdf-section-body">Se realizarán inspecciones planeadas y no planeadas al uso y estado de EPP, vehículos y herramientas. Mensualmente se enviará a <strong>{C}</strong> el reporte de horas hombre trabajadas y estadísticas de accidentabilidad conforme al Art. 73 del DS 44.</div>

                <div className="page-break"></div>
                <div className="pdf-section-title">11. INVESTIGACIÓN DE INCIDENTES Y ACCIDENTES</div>
                <div className="pdf-section-body">
                    Todo incidente (con o sin tiempo perdido) será reportado a la jefatura directa en un plazo máximo de 24 horas. El objetivo principal es identificar las causas raíces mediante metodologías estandarizadas (como el Árbol de Causas) para evitar su repetición. El supervisor a cargo y el Asesor SSO conformarán el equipo investigador, recopilando evidencias, testimonios y registros del lugar. Posteriormente, se elaborará un informe técnico que definirá las medidas correctivas y preventivas, designando responsables y plazos de ejecución. El cierre del incidente solo se concretará una vez verificada la implementación efectiva de dichas medidas en terreno.
                </div>

                <div className="pdf-section-title">12. Revisión y Mejora Continua</div>
                <div className="pdf-section-body">La gerencia de Wirin Ambiental revisará anualmente (o al término del proyecto) el desempeño de este SGSST, evaluando el cumplimiento de metas y actualizando la Matriz HIRA ante cambios en la legislación o en los procesos operativos, conforme al ciclo PDCA establecido en el DS 44.</div>

                {/* Signature Block — con carga de firma digital */}
                <div style={{ marginTop: "24px", borderTop: "2px solid #c8e6c9", paddingTop: "14px" }}>
                    <p style={{ fontSize: "9pt", fontWeight: 700, color: "#1B5E20", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Aprobación Documental</p>
                    <div className="pdf-signature-box">
                        <SignatureUpload label="Elaboró" name={SSO} role="Asesor QHSE — Wirin Ambiental" signatureDataUrl={sig1} onSignatureChange={setSig1} />
                        <SignatureUpload label="Revisó" name={PM} role="Jefe de Proyecto — Wirin Ambiental" signatureDataUrl={sig2} onSignatureChange={setSig2} />
                        <SignatureUpload label="Aprobó" name="Dirección General" role="Wirin Ambiental" signatureDataUrl={sig3} onSignatureChange={setSig3} />
                    </div>
                </div>

                <DocFooter code={CODE} version={version} date={docDate} page={3} total={3} />
            </div>
        </div>
    );
}
