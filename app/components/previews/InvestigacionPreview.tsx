import React, { useState } from "react";
import { InvestigacionData } from "../forms/InvestigacionForm";
import SignatureUpload from "../SignatureUpload";

interface Props {
    data: InvestigacionData;
}

export default function InvestigacionPreview({ data }: Props) {
    const [sig1, setSig1] = useState<string | null>(null);
    const [sig2, setSig2] = useState<string | null>(null);
    const [sig3, setSig3] = useState<string | null>(null);

    const CODE = "WA-INV-001";
    const VERSION = "01";

    const formattedDate = data.fecha
        ? new Date(data.fecha + "T00:00:00").toLocaleDateString("es-CL")
        : "DD/MM/YYYY";

    return (
        <div className="bg-gray-200 p-4 sm:p-8 ">
            <div
                id="investigacion-preview"
                className="bg-white shadow-2xl relative pdf-container pdf-document pdf-page"
                style={{
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
                                <div style={{ fontWeight: "bold", fontSize: "12pt", color: "#1B5E20" }}>INFORME DE INVESTIGACIÓN DE INCIDENTES</div>
                                <div style={{ fontSize: "9pt", marginTop: "4px" }}>SISTEMA DE GESTIÓN QHSE</div>
                            </td>
                            <td style={{ width: "25%", border: "1px solid #000", padding: "0", verticalAlign: "middle" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8pt", textAlign: "left" }}>
                                    <tbody>
                                        <tr><td style={{ borderBottom: "1px solid #000", padding: "4px 8px" }}><strong>CÓDIGO:</strong> {CODE}</td></tr>
                                        <tr><td style={{ borderBottom: "1px solid #000", padding: "4px 8px" }}><strong>VERSIÓN:</strong> {VERSION}</td></tr>
                                        <tr><td style={{ borderBottom: "1px solid #000", padding: "4px 8px" }}><strong>FECHA:</strong> {formattedDate}</td></tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ===== METODOLOGÍA ===== */}
                <div style={{ fontSize: "9pt", textAlign: "justify", marginBottom: "15px", fontStyle: "italic", color: "#333" }}>
                    "El objetivo principal es identificar las causas raíces mediante metodologías estandarizadas para evitar su repetición. El cierre del incidente solo se concretará una vez verificada la implementación efectiva de las medidas en terreno."
                </div>

                {/* ===== DATOS GENERALES ===== */}
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", marginBottom: "15px" }}>
                    <tbody>
                        <tr>
                            <td colSpan={4} style={{ border: "1px solid #000", padding: "4px 8px", backgroundColor: "#1B5E20", color: "white", fontWeight: "bold" }}>
                                1. DATOS DEL INCIDENTE
                            </td>
                        </tr>
                        <tr>
                            <td style={{ width: "20%", border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Fecha:</td>
                            <td style={{ width: "30%", border: "1px solid #000", padding: "6px" }}>{formattedDate}</td>
                            <td style={{ width: "20%", border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Hora:</td>
                            <td style={{ width: "30%", border: "1px solid #000", padding: "6px" }}>{data.hora || "NO ESPECIFICADA"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Supervisor Involucrado:</td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>{data.supervisor || "NO ESPECIFICADO"}</td>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Asesor SSO:</td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>{data.asesor || "NO ESPECIFICADO"}</td>
                        </tr>
                    </tbody>
                </table>

                {/* ===== DESCRIPCIÓN Y EVIDENCIAS ===== */}
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", marginBottom: "15px" }}>
                    <tbody>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "4px 8px", backgroundColor: "#1B5E20", color: "white", fontWeight: "bold" }}>
                                2. DESCRIPCIÓN Y EVIDENCIAS
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "8px", backgroundColor: "#f5f5f5", fontWeight: "bold", fontSize: "8pt", textAlign: "center" }}>
                                DESCRIPCIÓN DEL INCIDENTE
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "10px", minHeight: "60px", whiteSpace: "pre-wrap" }}>
                                {data.descripcion || "No se ha ingresado descripción."}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "8px", backgroundColor: "#f5f5f5", fontWeight: "bold", fontSize: "8pt", textAlign: "center" }}>
                                EVIDENCIAS Y TESTIMONIOS
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "10px", minHeight: "50px", whiteSpace: "pre-wrap" }}>
                                {data.evidencias || "No se han registrado evidencias."}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ===== DIAGRAMA ISHIKAWA (TABLA) ===== */}
                <table className="pdf-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", marginBottom: "15px" }}>
                    <thead>
                        <tr>
                            <th colSpan={2} style={{ border: "1px solid #000", padding: "4px 8px", backgroundColor: "#1B5E20", color: "white", fontWeight: "bold", textAlign: "left" }}>
                                3. ANÁLISIS DE CAUSA RAÍZ (METODOLOGÍA 6M)
                            </th>
                        </tr>
                        <tr style={{ backgroundColor: "#f5f5f5" }}>
                            <th style={{ width: "30%", border: "1px solid #000", padding: "6px", textAlign: "center" }}>Categoría (6M)</th>
                            <th style={{ width: "70%", border: "1px solid #000", padding: "6px", textAlign: "center" }}>Causas Raíz Identificadas</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", fontWeight: "bold" }}>Mano de Obra</td>
                            <td style={{ border: "1px solid #000", padding: "6px", whiteSpace: "pre-wrap" }}>{data.ishikawa.manoObra || "-"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", fontWeight: "bold" }}>Maquinaria / Equipos</td>
                            <td style={{ border: "1px solid #000", padding: "6px", whiteSpace: "pre-wrap" }}>{data.ishikawa.maquinaria || "-"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", fontWeight: "bold" }}>Métodos / Procedimientos</td>
                            <td style={{ border: "1px solid #000", padding: "6px", whiteSpace: "pre-wrap" }}>{data.ishikawa.metodos || "-"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", fontWeight: "bold" }}>Materiales</td>
                            <td style={{ border: "1px solid #000", padding: "6px", whiteSpace: "pre-wrap" }}>{data.ishikawa.materiales || "-"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", fontWeight: "bold" }}>Medio Ambiente</td>
                            <td style={{ border: "1px solid #000", padding: "6px", whiteSpace: "pre-wrap" }}>{data.ishikawa.medioAmbiente || "-"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", fontWeight: "bold" }}>Medición</td>
                            <td style={{ border: "1px solid #000", padding: "6px", whiteSpace: "pre-wrap" }}>{data.ishikawa.medicion || "-"}</td>
                        </tr>
                    </tbody>
                </table>

                {/* ===== PLAN DE ACCIÓN ===== */}
                <table className="pdf-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", marginBottom: "25px" }}>
                    <thead>
                        <tr>
                            <th colSpan={3} style={{ border: "1px solid #000", padding: "4px 8px", backgroundColor: "#1B5E20", color: "white", fontWeight: "bold", textAlign: "left" }}>
                                4. PLAN DE ACCIÓN Y MEDIDAS CORRECTIVAS
                            </th>
                        </tr>
                        <tr style={{ backgroundColor: "#f5f5f5" }}>
                            <th style={{ width: "50%", border: "1px solid #000", padding: "6px", textAlign: "center" }}>Medida Correctiva / Preventiva</th>
                            <th style={{ width: "30%", border: "1px solid #000", padding: "6px", textAlign: "center" }}>Responsable</th>
                            <th style={{ width: "20%", border: "1px solid #000", padding: "6px", textAlign: "center" }}>Plazo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.planAccion.length > 0 ? (
                            data.planAccion.map((accion, i) => (
                                <tr key={i}>
                                    <td style={{ border: "1px solid #000", padding: "6px", whiteSpace: "pre-wrap" }}>{accion.medida}</td>
                                    <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>{accion.responsable}</td>
                                    <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>
                                        {accion.plazo ? new Date(accion.plazo + "T00:00:00").toLocaleDateString("es-CL") : ""}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} style={{ border: "1px solid #000", padding: "10px", textAlign: "center", color: "#666", fontStyle: "italic" }}>
                                    No se registraron medidas en el plan de acción.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* ===== FIRMAS ===== */}
                <div style={{ pageBreakInside: "avoid" }}>
                    <div style={{ fontWeight: "bold", fontSize: "10pt", color: "#1B5E20", marginBottom: "15px", borderBottom: "2px solid #1B5E20", paddingBottom: "4px" }}>
                        5. APROBACIÓN DEL INFORME
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", textAlign: "center" }}>
                        <SignatureUpload
                            label="Elaboró"
                            name={data.elaboratedBy || "_____________________"}
                            role={data.elaboratedRole || "Asesor SSO"}
                            signatureDataUrl={sig1}
                            onSignatureChange={setSig1}
                        />
                        <SignatureUpload
                            label="Revisó"
                            name={data.reviewedBy || "_____________________"}
                            role={data.reviewedRole || "Jefe de Proyecto"}
                            signatureDataUrl={sig2}
                            onSignatureChange={setSig2}
                        />
                        <SignatureUpload
                            label="Aprobó"
                            name={data.approvedBy || "_____________________"}
                            role={data.approvedRole || "Gerencia"}
                            signatureDataUrl={sig3}
                            onSignatureChange={setSig3}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
