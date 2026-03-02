import React, { useState } from "react";
import { CharlaData } from "../forms/CharlaForm";
import SignatureUpload from "../SignatureUpload";

interface Props {
    data: CharlaData;
}

export default function CharlaPreview({ data }: Props) {
    const [firmasAsistentes, setFirmasAsistentes] = useState<Record<string, string>>({});
    const [firmaSupervisor, setFirmaSupervisor] = useState<string | null>(null);
    const [firmaAsesor, setFirmaAsesor] = useState<string | null>(null);

    const handleFirmaAsistente = (id: string, signature: string | null) => {
        if (signature) {
            setFirmasAsistentes((prev) => ({ ...prev, [id]: signature }));
        } else {
            setFirmasAsistentes((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }
    };

    const CODE = "WA-SST-FOR-04";
    const VERSION = "01";

    // Format date DD/MM/YYYY
    const formattedDate = data.fecha
        ? new Date(data.fecha + "T00:00:00").toLocaleDateString("es-CL")
        : "DD/MM/YYYY";

    // Rellenar filas vacías para que la tabla siempre tenga un mínimo de 10 o 15?
    // Lo dejaremos dinámico, pero con una tabla sólida.

    return (
        <div className="bg-gray-200 p-4 sm:p-8 min-h-screen flex justify-center overflow-auto">
            <div
                id="charla-preview"
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
                                <div style={{ fontWeight: "bold", fontSize: "14pt", color: "#1B5E20" }}>REGISTRO CHARLA DIARIA DE 5 MIN.</div>
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

                {/* ===== 1. DATOS DE LA CHARLA ===== */}
                <div style={{ backgroundColor: "#1B5E20", color: "white", padding: "4px 8px", fontWeight: "bold", fontSize: "10pt", marginBottom: "0", border: "1px solid #000", borderBottom: "none" }}>
                    1. ANTECEDENTES GENERALES
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", marginBottom: "20px" }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "15%", border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Proyecto:</td>
                            <td colSpan={3} style={{ border: "1px solid #000", padding: "6px" }}>{data.proyecto || "NO ESPECIFICADO"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Fecha:</td>
                            <td style={{ width: "35%", border: "1px solid #000", padding: "6px" }}>{formattedDate}</td>
                            <td style={{ width: "15%", border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Hora de Inicio:</td>
                            <td style={{ width: "35%", border: "1px solid #000", padding: "6px" }}>___:___ hrs</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Tema Principal:</td>
                            <td colSpan={3} style={{ border: "1px solid #000", padding: "6px", fontSize: "10pt", fontWeight: "bold", color: "#B71C1C" }}>
                                {data.tema || "TEMA DEL DÍA NO ESPECIFICADO"}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Dictada por:</td>
                            <td colSpan={3} style={{ border: "1px solid #000", padding: "6px" }}>{data.supervisor || "NO ESPECIFICADO"}</td>
                        </tr>
                    </tbody>
                </table>

                {/* ===== 2. ASISTENTES ===== */}
                <div style={{ backgroundColor: "#1B5E20", color: "white", padding: "4px 8px", fontWeight: "bold", fontSize: "10pt", marginBottom: "0", border: "1px solid #000", borderBottom: "none" }}>
                    2. REGISTRO DE ASISTENCIA Y COMPROMISO
                </div>
                <div style={{ fontSize: "8pt", textAlign: "justify", padding: "6px 0" }}>
                    Los firmantes declaran haber asistido a la charla diaria de seguridad de 5 minutos, entender los riesgos potenciales de la actividad a ejecutar y las medidas de control establecidas, y se comprometen a aplicarlas en su labor diaria.
                </div>
                <table className="pdf-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "8pt", marginBottom: "20px" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#e0e0e0", textAlign: "center", width: "5%" }}>N°</th>
                            <th style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#e0e0e0", textAlign: "center", width: "30%" }}>Nombre Completo</th>
                            <th style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#e0e0e0", textAlign: "center", width: "15%" }}>RUT</th>
                            <th style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#e0e0e0", textAlign: "center", width: "25%" }}>Cargo</th>
                            <th style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#e0e0e0", textAlign: "center", width: "25%" }}>Firma Trabajador</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.trabajadores.length > 0 ? (
                            data.trabajadores.map((t, idx) => (
                                <tr key={t.id} style={{ pageBreakInside: "avoid" }}>
                                    <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center", verticalAlign: "middle" }}>{idx + 1}</td>
                                    <td style={{ border: "1px solid #000", padding: "6px", verticalAlign: "middle" }}>{t.nombres}</td>
                                    <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center", verticalAlign: "middle" }}>{t.rut}</td>
                                    <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center", verticalAlign: "middle" }}>{t.cargo}</td>
                                    <td style={{ border: "1px solid #000", padding: "2px", textAlign: "center", verticalAlign: "middle", height: "50px" }}>
                                        <div style={{ transform: "scale(0.8)", transformOrigin: "center center" }}>
                                            <SignatureUpload
                                                onSignatureChange={(sig) => handleFirmaAsistente(t.id, sig)}
                                                name={t.nombres || "—"}
                                                role="Asistente"
                                                label="Firma"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ border: "1px solid #000", padding: "10px", textAlign: "center", fontStyle: "italic", color: "#666" }}>
                                    Sin asistentes registrados. Agregue trabajadores en el formulario izquierdo.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* ===== 3. VALIDACIÓN ===== */}
                <div style={{ backgroundColor: "#1B5E20", color: "white", padding: "4px 8px", fontWeight: "bold", fontSize: "10pt", marginBottom: "0", border: "1px solid #000", borderBottom: "none" }}>
                    3. VALIDACIÓN Y CIERRE
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000", height: "120px" }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "50%", borderRight: "1px solid #000", verticalAlign: "bottom", padding: "10px", textAlign: "center" }}>
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                                    <div style={{ width: "200px", margin: "0 auto" }}>
                                        <SignatureUpload
                                            onSignatureChange={setFirmaSupervisor}
                                            name={data.supervisor || "—"}
                                            role="Supervisor a Cargo (Dicta Charla)"
                                            label="Firma Supervisor"
                                        />
                                    </div>
                                </div>
                                <div style={{ borderTop: "1px solid #000", margin: "0 20px", display: "inline-block", padding: "5px 30px" }}>
                                    <strong>{data.supervisor || "Nombre del Supervisor"}</strong><br />
                                    Supervisor a Cargo (Dicta Charla)
                                </div>
                            </td>
                            <td style={{ width: "50%", verticalAlign: "bottom", padding: "10px", textAlign: "center" }}>
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                                    <div style={{ width: "200px", margin: "0 auto" }}>
                                        <SignatureUpload
                                            onSignatureChange={setFirmaAsesor}
                                            name="—"
                                            role="Depto. Prevención"
                                            label="Firma Asesor SSO"
                                        />
                                    </div>
                                </div>
                                <div style={{ borderTop: "1px solid #000", margin: "0 20px", display: "inline-block", padding: "5px 30px" }}>
                                    <strong>Nombre del Asesor SSO</strong><br />
                                    Depto. de Prevención de Riesgos
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

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
                    Wirin Ambiental - Registro Charla Diaria 5 Min.
                </div>

            </div>
        </div>
    );
}
