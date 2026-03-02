import React, { useState } from "react";
import { ComChecklistData, EQUIPOS_COMUNICACION } from "../forms/ComChecklistForm";
import SignatureUpload from "../SignatureUpload";

interface Props {
    data: ComChecklistData;
}

export default function ComChecklistPreview({ data }: Props) {
    const [firmaJefe, setFirmaJefe] = useState<string | null>(null);

    const CODE = "WA-SST-FOR-05";
    const VERSION = "01";

    // Format date DD/MM/YYYY
    const formattedDate = data.fecha
        ? new Date(data.fecha + "T00:00:00").toLocaleDateString("es-CL")
        : "DD/MM/YYYY";

    return (
        <div className="bg-gray-200 p-4 sm:p-8 ">
            <div
                id="comunicacion-preview"
                className="bg-white shadow-2xl relative"
                style={{
                    width: "210mm",
                    padding: "20mm 15mm 25mm 15mm",
                    margin: "0 auto",
                    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                    fontSize: "10pt",
                    color: "#000",
                    boxSizing: "border-box"
                }}
            >
                {/* ===== CABECERA FORMAL ===== */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "25%", border: "1px solid #000", padding: "10px", textAlign: "center", verticalAlign: "middle" }}>
                                <img src="/logo.png" alt="Logo Wirin Ambiental" style={{ maxHeight: "50px", maxWidth: "100%", objectFit: "contain", margin: "0 auto" }} />
                            </td>
                            <td style={{ width: "50%", border: "1px solid #000", padding: "10px", textAlign: "center", verticalAlign: "middle" }}>
                                <div style={{ fontWeight: "bold", fontSize: "14pt", color: "#1B5E20" }}>CHECKLIST COMUNICACIÓN Y EMERGENCIA (ZONAS REMOTAS)</div>
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

                {/* ===== 1. DATOS DE LA COMITIVA ===== */}
                <div style={{ backgroundColor: "#1B5E20", color: "white", padding: "4px 8px", fontWeight: "bold", fontSize: "10pt", marginBottom: "0", border: "1px solid #000", borderBottom: "none" }}>
                    1. DATOS DE LA CUADRILLA
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", marginBottom: "20px" }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "15%", border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Cuadrilla / Equipo:</td>
                            <td style={{ width: "35%", border: "1px solid #000", padding: "6px" }}>{data.cuadrilla || "NO ESPECIFICADO"}</td>
                            <td style={{ width: "15%", border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Fecha Salida:</td>
                            <td style={{ width: "35%", border: "1px solid #000", padding: "6px" }}>{formattedDate}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Destino / Ruta:</td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>{data.destino || "NO ESPECIFICADO"}</td>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Hora Salida:</td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>{data.horaSalida || "HH:mm"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Jefe Cuadrilla:</td>
                            <td colSpan={3} style={{ border: "1px solid #000", padding: "6px" }}>{data.jefeCuadrilla || "NO ESPECIFICADO"}</td>
                        </tr>
                    </tbody>
                </table>

                {/* ===== 2. INSPECCIÓN DE EQUIPOS DE COMUNICACIÓN ===== */}
                <div style={{ backgroundColor: "#1B5E20", color: "white", padding: "4px 8px", fontWeight: "bold", fontSize: "10pt", marginBottom: "0", border: "1px solid #000", borderBottom: "none" }}>
                    2. INSPECCIÓN Y PRUEBA DE EQUIPOS
                </div>
                <table className="pdf-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", marginBottom: "20px" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#e0e0e0", textAlign: "center", width: "5%" }}>N°</th>
                            <th style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#e0e0e0", textAlign: "left" }}>Equipo de Comunicación a Inspeccionar</th>
                            <th style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#e0e0e0", textAlign: "center", width: "12%" }}>OK</th>
                            <th style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#e0e0e0", textAlign: "center", width: "12%" }}>Malo</th>
                            <th style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#e0e0e0", textAlign: "center", width: "12%" }}>N/A</th>
                        </tr>
                    </thead>
                    <tbody>
                        {EQUIPOS_COMUNICACION.map((item, idx) => {
                            const state = data.equipos[item] || "";
                            return (
                                <tr key={idx} style={{ pageBreakInside: "avoid" }}>
                                    <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>{idx + 1}</td>
                                    <td style={{ border: "1px solid #000", padding: "6px" }}>{item}</td>
                                    <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>
                                        {state === "Bueno" ? <strong style={{ color: "#1B5E20", fontSize: "12pt" }}>X</strong> : ""}
                                    </td>
                                    <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>
                                        {state === "Malo" ? <strong style={{ color: "#B71C1C", fontSize: "12pt" }}>X</strong> : ""}
                                    </td>
                                    <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>
                                        {state === "NA" ? <strong style={{ fontSize: "12pt" }}>X</strong> : ""}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* ===== 3. DECLARACIÓN Y FIRMA ===== */}
                <div style={{ backgroundColor: "#1B5E20", color: "white", padding: "4px 8px", fontWeight: "bold", fontSize: "10pt", marginBottom: "0", border: "1px solid #000", borderBottom: "none", marginTop: "30px" }}>
                    3. VALIDACIÓN PARA INGRESO A ZONA REMOTA
                </div>
                <div style={{ border: "1px solid #000", padding: "12px", fontSize: "9pt", textAlign: "center" }}>
                    <p style={{ margin: "0 0 20px 0", fontStyle: "italic", fontSize: "10pt", color: "#B71C1C", fontWeight: "bold" }}>
                        "Confirmamos que los equipos de comunicación están operativos y probados antes de ingresar a zona sin cobertura de red móvil tradicional."
                    </p>

                    <div className="pdf-signature-box" style={{
                        display: "flex",
                        justifyContent: "center",
                        pageBreakInside: "avoid"
                    }}>
                        <div style={{ width: "250px", textAlign: "center" }}>
                            <SignatureUpload
                                onSignatureChange={setFirmaJefe}
                                name={data.jefeCuadrilla || "Nombre Jefe Cuadrilla"}
                                role="Jefe de Cuadrilla / Líder Terreno"
                                label="Firma Jefe Cuadrilla"
                            />
                        </div>
                    </div>
                </div>

                {/* ===== FOOTER ESTÁNDAR ===== */}
                <div style={{
                    position: "absolute",
                    bottom: "15mm",
                    left: "15mm",
                    right: "15mm",
                    textAlign: "center",
                    fontSize: "8pt",
                    color: "#555",
                    borderTop: "1px solid #ccc",
                    paddingTop: "5px"
                }}>
                    Wirin Ambiental - Checklist Comunicación Zonas Remotas
                </div>

            </div>
        </div>
    );
}
