import React, { useState } from "react";
import { PREData } from "../forms/PREForm";
import SignatureUpload from "../SignatureUpload";

interface Props {
    data: PREData;
}

export default function PREPreview({ data }: Props) {
    const [firmaSSO, setFirmaSSO] = useState<string | null>(null);
    const [firmaMandante, setFirmaMandante] = useState<string | null>(null);

    const CODE = "WA-PRE-001";
    const VERSION = "01";

    const formattedDate = data.fecha
        ? new Date(data.fecha + "T00:00:00").toLocaleDateString("es-CL")
        : "DD/MM/YYYY";

    return (
        <div className="bg-gray-200 p-4 sm:p-8 min-h-screen flex justify-center overflow-auto">
            <div
                id="pre-preview"
                className="bg-white shadow-2xl relative pdf-container"
                style={{
                    width: "210mm",
                    minHeight: "297mm",
                    padding: "20mm 15mm 25mm 15mm",
                    margin: "0 auto",
                    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                    fontSize: "10pt",
                    color: "#000",
                    boxSizing: "border-box"
                }}
            >
                {/* ===== CABECERA FORMAL ===== */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "15px" }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "25%", border: "1px solid #000", padding: "10px", textAlign: "center", verticalAlign: "middle" }}>
                                <img src="/logo.png" alt="Logo Wirin Ambiental" style={{ maxHeight: "50px", maxWidth: "100%", objectFit: "contain", margin: "0 auto" }} />
                            </td>
                            <td style={{ width: "50%", border: "1px solid #000", padding: "10px", textAlign: "center", verticalAlign: "middle" }}>
                                <div style={{ fontWeight: "bold", fontSize: "12pt", color: "#1B5E20" }}>PLAN DE RESPUESTA A EMERGENCIAS Y MEDEVAC</div>
                                <div style={{ fontSize: "9pt", marginTop: "4px" }}>SISTEMA DE GESTIÓN QHSE</div>
                            </td>
                            <td style={{ width: "25%", border: "1px solid #000", padding: "0", verticalAlign: "middle" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8pt", textAlign: "left" }}>
                                    <tbody>
                                        <tr><td style={{ borderBottom: "1px solid #000", padding: "4px 8px" }}><strong>CÓDIGO:</strong> {CODE}</td></tr>
                                        <tr><td style={{ borderBottom: "1px solid #000", padding: "4px 8px" }}><strong>VERSIÓN:</strong> {VERSION}</td></tr>
                                        <tr><td style={{ borderBottom: "1px solid #000", padding: "4px 8px" }}><strong>FECHA:</strong> {formattedDate}</td></tr>
                                        <tr><td style={{ padding: "4px 8px" }}><strong>PÁGINA:</strong> 1 de X</td></tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ===== DATOS DEL PROYECTO ===== */}
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", marginBottom: "15px" }}>
                    <tbody>
                        <tr>
                            <td colSpan={4} style={{ border: "1px solid #000", padding: "4px 8px", backgroundColor: "#1B5E20", color: "white", fontWeight: "bold" }}>
                                1. IDENTIFICACIÓN DEL PROYECTO
                            </td>
                        </tr>
                        <tr>
                            <td style={{ width: "20%", border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Proyecto:</td>
                            <td style={{ width: "30%", border: "1px solid #000", padding: "6px" }}>{data.proyecto || "NO ESPECIFICADO"}</td>
                            <td style={{ width: "20%", border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Mandante:</td>
                            <td style={{ width: "30%", border: "1px solid #000", padding: "6px" }}>{data.mandante || "NO ESPECIFICADO"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Ubicación Exacta:</td>
                            <td colSpan={3} style={{ border: "1px solid #000", padding: "6px" }}>{data.ubicacion || "NO ESPECIFICADA"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Jefe de Cuadrilla:</td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>
                                {data.jefeCuadrilla || "NO ESPECIFICADO"} <br />
                                {data.fonoJefe && <span style={{ fontSize: "8pt", color: "#666" }}>Tel: {data.fonoJefe}</span>}
                            </td>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Asesor SSO:</td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>
                                {data.asesorSso || "NO ESPECIFICADO"} <br />
                                {data.fonoSso && <span style={{ fontSize: "8pt", color: "#666" }}>Tel: {data.fonoSso}</span>}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ===== OBJETIVO ===== */}
                <div style={{ marginBottom: "15px" }}>
                    <div style={{ border: "1px solid #000", padding: "4px 8px", backgroundColor: "#1B5E20", color: "white", fontWeight: "bold", fontSize: "9pt", borderBottom: "none" }}>
                        2. OBJETIVO DEL PLAN Y MEDEVAC
                    </div>
                    <div style={{ border: "1px solid #000", padding: "8px", fontSize: "9pt", textAlign: "justify", lineHeight: "1.4" }}>
                        Establecer el procedimiento de evacuación médica (MEDEVAC) y respuesta ante emergencias durante las labores de monitoreo de flora y fauna en zonas agrestes, minimizando el tiempo de respuesta y asegurando la atención oportuna.
                    </div>
                </div>

                {/* ===== FLUJOGRAMA DE COMUNICACIÓN MEDEVAC ===== */}
                <div style={{ marginBottom: "15px", pageBreakInside: "avoid" }}>
                    <div style={{ border: "1px solid #000", padding: "4px 8px", backgroundColor: "#1B5E20", color: "white", fontWeight: "bold", fontSize: "9pt", borderBottom: "none" }}>
                        3. FLUJOGRAMA DE COMUNICACIÓN MEDEVAC
                    </div>
                    <div className="print:break-inside-avoid" style={{ border: "1px solid #000", padding: "15px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", backgroundColor: "#fdfdfd" }}>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                            <div style={{ backgroundColor: "#ef4444", color: "white", padding: "8px 16px", borderRadius: "4px", fontWeight: "bold", fontSize: "9pt", textAlign: "center", width: "300px", border: "2px solid #b91c1c" }}>
                                1. ACCIDENTE
                            </div>
                        </div>

                        <div style={{ fontSize: "14pt", color: "#4b5563", lineHeight: "1" }}>↓</div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                            <div style={{ backgroundColor: "#f59e0b", color: "white", padding: "8px 16px", borderRadius: "4px", fontWeight: "bold", fontSize: "9pt", textAlign: "center", width: "300px", border: "2px solid #d97706" }}>
                                2. EVALUACIÓN PRIMARIA / PRIMEROS AUXILIOS
                            </div>
                        </div>

                        <div style={{ fontSize: "14pt", color: "#4b5563", lineHeight: "1" }}>↓</div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                            <div style={{ backgroundColor: "#3b82f6", color: "white", padding: "8px 16px", borderRadius: "4px", fontWeight: "bold", fontSize: "9pt", textAlign: "center", width: "300px", border: "2px solid #2563eb" }}>
                                3. AVISO INMEDIATO A JEFE DE CUADRILLA
                            </div>
                        </div>

                        <div style={{ fontSize: "14pt", color: "#4b5563", lineHeight: "1" }}>↓</div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", gap: "20px" }}>
                            <div style={{ backgroundColor: "#8b5cf6", color: "white", padding: "8px 16px", borderRadius: "4px", fontWeight: "bold", fontSize: "9pt", textAlign: "center", width: "240px", border: "2px solid #6d28d9" }}>
                                4. AVISO A MANDANTE / MUTUALIDAD
                            </div>
                            <div style={{ fontSize: "14pt", color: "#4b5563", lineHeight: "1" }}>←</div>
                            <div style={{ backgroundColor: "#10b981", color: "white", padding: "8px 16px", borderRadius: "4px", fontWeight: "bold", fontSize: "9pt", textAlign: "center", width: "240px", border: "2px solid #059669" }}>
                                4. EVALUACIÓN DE TRASLADO <br />
                                <span style={{ fontSize: "8pt", fontWeight: "normal" }}>(¿Ambulancia o Vehículo Apoyo?)</span>
                            </div>
                        </div>

                        <div style={{ fontSize: "14pt", color: "#4b5563", lineHeight: "1" }}>↓</div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                            <div style={{ backgroundColor: "#64748b", color: "white", padding: "8px 16px", borderRadius: "4px", fontWeight: "bold", fontSize: "9pt", textAlign: "center", width: "300px", border: "2px solid #475569" }}>
                                5. LLEGADA A CENTRO ASISTENCIAL
                            </div>
                        </div>

                    </div>
                </div>

                {/* ===== PROTOCOLOS DE TERRENO ===== */}
                <div className="page-break"></div>
                <div style={{ marginBottom: "15px" }}>
                    <div style={{ border: "1px solid #000", padding: "4px 8px", backgroundColor: "#1B5E20", color: "white", fontWeight: "bold", fontSize: "9pt", borderBottom: "none" }}>
                        4. PROTOCOLOS ESPECÍFICOS DE TERRENO
                    </div>
                    <div style={{ border: "1px solid #000", padding: "10px", fontSize: "9pt", textAlign: "justify" }}>

                        <div style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
                            <strong style={{ color: "#b91c1c", fontSize: "9.5pt" }}>A. Emergencias Relacionadas con Fauna Sensible (Ofidios y Arácnidos)</strong>
                            <ul style={{ margin: "6px 0 0 24px", paddingLeft: "15px", lineHeight: "1.5", listStyleType: "disc", fontSize: "8.5pt" }}>
                                <li><strong>Identificación de la situación:</strong> Ocurrencia de mordedura por culebra de cola corta/larga, o picadura de araña de rincón/trigo durante la inspección de cuadrantes o transectas.</li>
                                <li><strong>Acción Inmediata:</strong> Aislar a la víctima del agente causante. Mantener al afectado en estricto reposo (evitar caminar o moverse) para ralentizar el ritmo cardíaco y la circulación del veneno en su torrente sanguíneo.</li>
                                <li><strong>Primeros Auxilios:</strong> Lavar la herida con abundante agua limpia o suero fisiológico. <strong>NO realizar</strong> torniquetes, incisiones, ni succión del veneno bajo ninguna circunstancia.</li>
                                <li><strong>Registro Visual:</strong> Si es seguro, tomar fotografías del animal agresor a distancia para facilitar la administración del antídoto en el centro de salud.</li>
                                <li><strong>Evacuación:</strong> Traslado prioritario, activando la cadena MEDEVAC al centro asistencial de mayor complejidad (según la matriz de centros) que cuente con sueros antiofídicos/aracnológicos.</li>
                            </ul>
                        </div>

                        <div style={{ marginBottom: "12px", pageBreakInside: "avoid", borderTop: "1px solid #e5e7eb", paddingTop: "8px" }}>
                            <strong style={{ color: "#d97706", fontSize: "9.5pt" }}>B. Emergencias por Accidentes Topográficos (Caídas a Distinto Nivel)</strong>
                            <ul style={{ margin: "6px 0 0 24px", paddingLeft: "15px", lineHeight: "1.5", listStyleType: "disc", fontSize: "8.5pt" }}>
                                <li><strong>Identificación de la situación:</strong> Caídas o deslizamientos de trabajadores mientras inspeccionan y transitan por áreas de quebradas, laderas con pendiente pronunciada o superficies húmedas.</li>
                                <li><strong>Acción Inmediata:</strong> El testigo del evento informará a viva voz al equipo. Nadie debe exponerse a la misma zona inestable al intentar un rescate desprovisto de equipo técnico.</li>
                                <li><strong>Primeros Auxilios:</strong> <strong>NO MOVER</strong> a la víctima si se sospecha o existe impacto cervical o en la columna, a menos que su vida corra grave peligro inminente por desprendimiento de material. Abrigar a la persona para evitar hipotermia mientras llega el vehículo de apoyo.</li>
                                <li><strong>Evacuación:</strong> Para extracciones en zonas de difícil acceso (Zanjas/Quebradas), contactar por radio o satelital activando el rescate externo del GOPE/Bomberos/SATE entregando de inmediato las coordenadas GPS estipuladas en punto N°1.</li>
                            </ul>
                        </div>

                        <div style={{ pageBreakInside: "avoid", borderTop: "1px solid #e5e7eb", paddingTop: "8px" }}>
                            <strong style={{ color: "#2563eb", fontSize: "9.5pt" }}>C. Reacciones Alérgicas Severas (Shock Anafiláctico)</strong>
                            <ul style={{ margin: "6px 0 0 24px", paddingLeft: "15px", lineHeight: "1.5", listStyleType: "disc", fontSize: "8.5pt" }}>
                                <li><strong>Identificación de la situación:</strong> Trabajador expone inflamación en el rostro, ronchas múltiples, o dificultad restrictiva para respirar posterior al contacto con flora o picadura de insecto (Ej. Avispas/Abejas).</li>
                                <li><strong>Acción Inmediata:</strong> Detener toda actividad y ubicar al afectado en un área sombreada, despejar el espacio ventilado, aflojar ropa apretada y evaluar permeabilidad de vías aéreas (ABC del trauma).</li>
                                <li><strong>Primeros Auxilios:</strong> Si el afectado tiene antecedentes conocidos y porta como prescripción médica su lápiz autoinyector de epinefrina (EpiPen), asistir en facilitárselo para su autosuministro.</li>
                                <li><strong>Evacuación:</strong> Informar por radio la criticidad respiratoria y activar alarma para interceptación en ruta. El traslado debe ser a prioridad máxima, con monitorización de signos vitales al centro asistencial más cercano.</li>
                            </ul>
                        </div>

                    </div>
                </div>

                {/* ===== MATRIZ DE EVACUACIÓN (TABLA DINÁMICA) ===== */}
                <div className="page-break"></div>
                <div style={{ marginBottom: "15px", pageBreakInside: "avoid" }}>
                    <div style={{ border: "1px solid #000", padding: "4px 8px", backgroundColor: "#1B5E20", color: "white", fontWeight: "bold", fontSize: "9pt", borderBottom: "none" }}>
                        5. MATRIZ DE EVACUACIÓN Y CENTROS ASISTENCIALES
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8.5pt", border: "1px solid #000" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#e0e0e0" }}>
                                <th style={{ border: "1px solid #000", padding: "6px", width: "20%" }}>Nivel de Complejidad</th>
                                <th style={{ border: "1px solid #000", padding: "6px", width: "25%" }}>Nombre Centro Médico</th>
                                <th style={{ border: "1px solid #000", padding: "6px", width: "30%" }}>Dirección</th>
                                <th style={{ border: "1px solid #000", padding: "6px", width: "10%", textAlign: "center" }}>Distancia</th>
                                <th style={{ border: "1px solid #000", padding: "6px", width: "15%", textAlign: "center" }}>Tiempo Est.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.centros.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ border: "1px solid #000", padding: "10px", textAlign: "center", fontStyle: "italic", color: "#666" }}>
                                        No hay centros asistenciales registrados en este plan.
                                    </td>
                                </tr>
                            ) : (
                                data.centros.map((centro, i) => (
                                    <tr key={i} style={{ pageBreakInside: "avoid" }}>
                                        <td style={{ border: "1px solid #000", padding: "6px", fontWeight: "bold" }}>{centro.tipo || "—"}</td>
                                        <td style={{ border: "1px solid #000", padding: "6px" }}>{centro.nombre || "—"}</td>
                                        <td style={{ border: "1px solid #000", padding: "6px" }}>{centro.direccion || "—"}</td>
                                        <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>{centro.distancia || "—"}</td>
                                        <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>{centro.tiempo || "—"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ===== FIRMAS DE VALIDACIÓN ===== */}
                <div style={{ pageBreakInside: "avoid", marginTop: "30px", borderTop: "2px solid #000", paddingTop: "20px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tbody>
                            <tr>
                                <td style={{ width: "50%", padding: "10px", textAlign: "center" }}>
                                    <div style={{ width: "250px", margin: "0 auto" }}>
                                        <SignatureUpload
                                            onSignatureChange={setFirmaSSO}
                                            name={data.asesorSso || "—"}
                                            role="Asesor SSO"
                                            label="Elaborado por (SSO)"
                                        />
                                    </div>
                                </td>
                                <td style={{ width: "50%", padding: "10px", textAlign: "center" }}>
                                    <div style={{ width: "250px", margin: "0 auto" }}>
                                        <SignatureUpload
                                            onSignatureChange={setFirmaMandante}
                                            name={data.mandante || "—"}
                                            role="Mandante / Jefe de Proyecto"
                                            label="Aprobado por"
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* ===== OVERLAY FOOTER GLOBAL (Wirin Estándar) ===== */}
                {/* As per previous rules, global fixed footers aren't guaranteed with basic html2pdf out of the box so we depend on proper margin rendering or absolute positioning. */}

            </div>
        </div>
    );
}
