import React, { useState } from "react";
import { ODIData } from "../forms/ODIForm";
import SignatureUpload from "../SignatureUpload";

interface Props {
    data: ODIData;
}

const RIESGOS_GENERALES = [
    { peligro: "Tránsito por superficies irregulares o desniveles", riesgo: "Caídas a distinto o mismo nivel, esguinces, contusiones", medida: "Uso de calzado de seguridad (botín/zapato), caminar atento a las condiciones del terreno, no correr, mantener áreas despejadas." },
    { peligro: "Exposición a radiación UV de origen solar", riesgo: "Quemaduras solares, envejecimiento prematuro de la piel, queratitis, cáncer a la piel", medida: "Uso de bloqueador solar factor 50+, uso de legión extranjera, uso de ropa de manga larga, hidratación constante." },
    { peligro: "Manejo manual de carga", riesgo: "Sobreesfuerzo, lumbago, lesiones músculo-esqueléticas", medida: "No exceder los límites maximos permitidos (25 kg hombres, 20 kg mujeres). Solicitar ayuda para cargas excesivas." },
    { peligro: "Sismos / Terremotos", riesgo: "Atrapamiento, golpes por objetos contundentes, pánico", medida: "Mantener la calma, dirigirse a zonas de seguridad establecidas, alejarse de estructuras inestables, seguir instrucciones de brigadistas." }
];

const RIESGOS_BIOTICOS = [
    { peligro: "Contacto e interacción con fauna silvestre, insectos o arácnidos", riesgo: "Picaduras, mordeduras, zoonosis, shock anafiláctico", medida: "No interactuar ni alimentar a la fauna silvestre. Uso de repelente contra insectos. Estar atento al entorno. Conocer protocolo de mordeduras." },
    { peligro: "Exposición a temperaturas extremas en terreno", riesgo: "Estrés térmico (frío/calor), deshidratación, hipotermia, golpe de calor", medida: "Uso de ropa por capas, hidratación constante (agua potable proporcionada), realizar pausas en sombra, planificación del trabajo." },
    { peligro: "Trabajo en solitario en áreas remotas o densas", riesgo: "Desorientación, caída sin rescate oportuno", medida: "Comunicación obligatoria mediante radio VHF / Satelital. Uso de GPS. Reporte frecuente de posición." }
];

export default function ODIPreview({ data }: Props) {
    const [firmaTrabajador, setFirmaTrabajador] = useState<string | null>(null);
    const [firmaEmpresa, setFirmaEmpresa] = useState<string | null>(null);

    const CODE = "WA-SST-FOR-06";
    const VERSION = "01";

    const formattedDate = data.fecha
        ? new Date(data.fecha + "T00:00:00").toLocaleDateString("es-CL")
        : "DD/MM/YYYY";

    const renderTable = (riesgos: { peligro: string, riesgo: string, medida: string }[], title: string) => (
        <div style={{ marginBottom: "20px", pageBreakInside: "avoid" }}>
            <div style={{ backgroundColor: "#1B5E20", color: "white", padding: "4px 8px", fontWeight: "bold", fontSize: "10pt", marginBottom: "0", border: "1px solid #000", borderBottom: "none" }}>
                {title}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", border: "1px solid #000" }}>
                <thead>
                    <tr style={{ backgroundColor: "#e0e0e0" }}>
                        <th style={{ border: "1px solid #000", padding: "6px", width: "25%" }}>PELIGRO</th>
                        <th style={{ border: "1px solid #000", padding: "6px", width: "30%" }}>RIESGO ASOCIADO</th>
                        <th style={{ border: "1px solid #000", padding: "6px", width: "45%" }}>MEDIDAS PREVENTIVAS / MÉTODOS DE TRABAJO CORRECTO</th>
                    </tr>
                </thead>
                <tbody>
                    {riesgos.map((r, i) => (
                        <tr key={i} style={{ pageBreakInside: "avoid" }}>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>{r.peligro}</td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>{r.riesgo}</td>
                            <td style={{ border: "1px solid #000", padding: "6px", textAlign: "justify" }}>{r.medida}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="bg-gray-200 p-4 sm:p-8 min-h-screen flex justify-center overflow-auto">
            <div
                id="odi-preview"
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
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "25%", border: "1px solid #000", padding: "10px", textAlign: "center", verticalAlign: "middle" }}>
                                <img src="/logo.png" alt="Logo Wirin Ambiental" style={{ maxHeight: "50px", maxWidth: "100%", objectFit: "contain", margin: "0 auto" }} />
                            </td>
                            <td style={{ width: "50%", border: "1px solid #000", padding: "10px", textAlign: "center", verticalAlign: "middle" }}>
                                <div style={{ fontWeight: "bold", fontSize: "14pt", color: "#1B5E20" }}>OBLIGACIÓN DE INFORMAR LOS RIESGOS LABORALES (ODI)</div>
                                <div style={{ fontSize: "9pt", marginTop: "4px" }}>SISTEMA DE GESTIÓN QHSE</div>
                            </td>
                            <td style={{ width: "25%", border: "1px solid #000", padding: "0", verticalAlign: "middle" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8pt", textAlign: "left" }}>
                                    <tbody>
                                        <tr><td style={{ borderBottom: "1px solid #000", padding: "4px 8px" }}><strong>CÓDIGO:</strong> {CODE}</td></tr>
                                        <tr><td style={{ borderBottom: "1px solid #000", padding: "4px 8px" }}><strong>VERSIÓN:</strong> {VERSION}</td></tr>
                                        <tr><td style={{ borderBottom: "1px solid #000", padding: "4px 8px" }}><strong>FECHA:</strong> {formattedDate}</td></tr>
                                        <tr><td style={{ padding: "4px 8px" }}><strong>PÁGINA:</strong> 1 de 1</td></tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ===== PÁRRAFO LEGAL ===== */}
                <div style={{ textAlign: "justify", marginBottom: "20px", fontSize: "9.5pt", lineHeight: "1.4" }}>
                    En cumplimiento al <strong>Artículo 15 del D.S. N° 44</strong> (Reglamento sobre la Gestión de los Riesgos Profesionales),
                    se garantiza informar al trabajador/a, de forma oportuna y adecuada previo al inicio de sus labores, sobre los riesgos
                    inherentes a su actividad, las medidas preventivas aplicables, los procedimientos de trabajo correctos y las
                    características de su lugar de trabajo, conforme a lo establecido en la matriz de riesgos de la organización.
                </div>

                {/* ===== DATOS DEL TRABAJADOR ===== */}
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", marginBottom: "20px" }}>
                    <tbody>
                        <tr>
                            <td colSpan={4} style={{ border: "1px solid #000", padding: "4px 8px", backgroundColor: "#1B5E20", color: "white", fontWeight: "bold" }}>
                                ANTECEDENTES DEL TRABAJADOR
                            </td>
                        </tr>
                        <tr>
                            <td style={{ width: "15%", border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Nombre Completo:</td>
                            <td style={{ width: "35%", border: "1px solid #000", padding: "6px" }}>{data.nombres || "NO ESPECIFICADO"}</td>
                            <td style={{ width: "15%", border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>RUT:</td>
                            <td style={{ width: "35%", border: "1px solid #000", padding: "6px" }}>{data.rut || "NO ESPECIFICADO"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Cargo:</td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>{data.cargo || "NO ESPECIFICADO"}</td>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Fecha:</td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>{formattedDate}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Empresa:</td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>{data.empresa || "Wirin Ambiental"}</td>
                            <td style={{ border: "1px solid #000", padding: "6px", backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Proyecto:</td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>{data.proyecto || "NO ESPECIFICADO"}</td>
                        </tr>
                    </tbody>
                </table>

                {/* ===== MATRIZ DE RIESGOS ===== */}
                {renderTable(RIESGOS_GENERALES, "RIESGOS GENERALES DE LA ORGANIZACIÓN")}

                {data.cargo === "Especialista en Medio Biótico" &&
                    renderTable(RIESGOS_BIOTICOS, "RIESGOS ESPECÍFICOS: ESPECIALISTA EN MEDIO BIÓTICO")
                }

                {/* ===== CIERRE Y FIRMAS ===== */}
                <div style={{ pageBreakInside: "avoid", marginTop: "30px", borderTop: "2px solid #000", paddingTop: "20px" }}>
                    <p style={{ textAlign: "justify", fontSize: "9pt", fontWeight: "bold", marginBottom: "20px" }}>
                        Declaro haber recibido instrucción, información y capacitación sobre los riesgos inherentes a mi función, y me comprometo a
                        cumplir con las medidas preventivas, el uso correcto de los Elementos de Protección Personal (EPP) y los reglamentos internos
                        de la organización y proyectos donde me desempeñe.
                    </p>

                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tbody>
                            <tr>
                                <td style={{ width: "50%", padding: "10px", textAlign: "center" }}>
                                    <div style={{ width: "250px", margin: "0 auto" }}>
                                        <SignatureUpload
                                            onSignatureChange={setFirmaTrabajador}
                                            name={data.nombres || "—"}
                                            role={data.cargo || "Trabajador"}
                                            label="Firma Trabajador"
                                        />
                                    </div>
                                </td>
                                <td style={{ width: "50%", padding: "10px", textAlign: "center" }}>
                                    <div style={{ width: "250px", margin: "0 auto" }}>
                                        <SignatureUpload
                                            onSignatureChange={setFirmaEmpresa}
                                            name="Representante SSMA"
                                            role="Wirin Ambiental"
                                            label="Firma Empleador / Asesor SSO"
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* ===== FOOTER ESTÁNDAR ===== */}
                {/* Usamos fixed postion via CSS to repeat or absolute for single page, we'll keep it absolute since it's hard to predict in PDF, html2pdf has limitations */}
            </div>
        </div>
    );
}
