import React, { useState } from "react";
import { VehiculoData, CHECKLIST_ITEMS } from "../forms/VehiculoForm";
import SignatureUpload from "../SignatureUpload";

interface Props {
    data: VehiculoData;
}

export default function VehiculoPreview({ data }: Props) {
    const [firmaConductor, setFirmaConductor] = useState<string | null>(null);

    const CODE = "WA-SST-FOR-03";
    const VERSION = "01";

    // Format date DD/MM/YYYY
    const formattedDate = data.fecha
        ? new Date(data.fecha + "T00:00:00").toLocaleDateString("es-CL")
        : "DD/MM/YYYY";

    return (
        <div className="bg-gray-200 p-4 sm:p-8 ">
            <div
                id="vehiculo-preview"
                className="bg-white shadow-2xl relative"
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
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "25%", border: "1px solid #000", padding: "10px", textAlign: "center", verticalAlign: "middle" }}>
                                <img src="/logo.png" alt="Logo Wirin Ambiental" style={{ maxHeight: "50px", maxWidth: "100%", objectFit: "contain", margin: "0 auto" }} />
                            </td>
                            <td style={{ width: "50%", border: "1px solid #000", padding: "10px", textAlign: "center", verticalAlign: "middle" }}>
                                <div style={{ fontWeight: "bold", fontSize: "14pt", color: "#1B5E20" }}>CHECKLIST INSPECCIÓN DE VEHÍCULOS (4x4)</div>
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

                {/* ===== 1. DATOS DEL VEHÍCULO Y CONDUCTOR ===== */}
                <div style={{ backgroundColor: "#1B5E20", color: "white", padding: "4px 8px", fontWeight: "bold", fontSize: "10pt", marginBottom: "0", border: "1px solid #000", borderBottom: "none" }}>
                    1. DATOS GENERALES
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", marginBottom: "20px" }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "15%", border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Fecha:</td>
                            <td style={{ width: "35%", border: "1px solid #000", padding: "6px" }}>{formattedDate}</td>
                            <td style={{ width: "15%", border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Hora:</td>
                            <td style={{ width: "35%", border: "1px solid #000", padding: "6px" }}>{data.hora || "HH:mm"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Proyecto:</td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>{data.proyecto || "NO ESPECIFICADO"}</td>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Mandante:</td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>{data.mandante || "NO ESPECIFICADO"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Conductor:</td>
                            <td colSpan={3} style={{ border: "1px solid #000", padding: "6px" }}>{data.conductor || "NO ESPECIFICADO"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Patente:</td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>{data.patente || "___-___"}</td>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Kilometraje:</td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>{data.kilometraje ? `${data.kilometraje} Km` : "0 Km"}</td>
                        </tr>
                    </tbody>
                </table>

                {/* ===== 2. CHECKLIST DE INSPECCIÓN ===== */}
                <div style={{ backgroundColor: "#1B5E20", color: "white", padding: "4px 8px", fontWeight: "bold", fontSize: "10pt", marginBottom: "0", border: "1px solid #000", borderBottom: "none" }}>
                    2. PUNTOS DE INSPECCIÓN
                </div>
                <table className="pdf-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", marginBottom: "20px" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#e0e0e0", textAlign: "center", width: "5%" }}>N°</th>
                            <th style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#e0e0e0", textAlign: "left" }}>Elemento / Sistema a Inspeccionar</th>
                            <th style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#e0e0e0", textAlign: "center", width: "12%" }}>Bueno</th>
                            <th style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#e0e0e0", textAlign: "center", width: "12%" }}>Malo</th>
                            <th style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#e0e0e0", textAlign: "center", width: "12%" }}>N/A</th>
                        </tr>
                    </thead>
                    <tbody>
                        {CHECKLIST_ITEMS.map((item, idx) => {
                            const state = data.items[item] || "";
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

                {/* ===== 3. OBSERVACIONES ===== */}
                <div style={{ backgroundColor: "#1B5E20", color: "white", padding: "4px 8px", fontWeight: "bold", fontSize: "10pt", marginBottom: "0", border: "1px solid #000", borderBottom: "none" }}>
                    3. OBSERVACIONES AL ESTADO DEL VEHÍCULO
                </div>
                <div style={{ border: "1px solid #000", padding: "10px", minHeight: "80px", fontSize: "9pt", marginBottom: "30px", whiteSpace: "pre-wrap" }}>
                    {data.observaciones || "Sin observaciones registradas."}
                </div>

                {/* ===== 4. FIRMAS ===== */}
                <div className="pdf-signature-box" style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "40px",
                    pageBreakInside: "avoid"
                }}>
                    <div style={{ width: "250px", textAlign: "center" }}>
                        <SignatureUpload
                            onSignatureChange={setFirmaConductor}
                            name={data.conductor || "Nombre del Conductor"}
                            role="Conductor / Operador"
                            label="Firma Conductor"
                        />
                        <div style={{ borderTop: "1px solid #000", marginTop: "10px", paddingTop: "5px", fontSize: "9pt" }}>
                            <strong>{data.conductor || "Nombre del Conductor"}</strong><br />
                            Conductor Responsable
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
                    Wirin Ambiental - Checklist Inspección Vehículos
                </div>

            </div>
        </div>
    );
}
