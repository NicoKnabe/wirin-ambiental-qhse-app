"use client";

import { useState } from "react";
import Letterhead from "../Letterhead";
import { EPPData } from "../forms/EPPForm";
import SignatureUpload from "../SignatureUpload";

interface EPPPreviewProps { data: EPPData; }

function formatDate(dateStr: string): string {
    if (!dateStr) return "[Fecha]";
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("es-CL");
}

// ─── Default EPP rows matching PTS corrected list ───────────────────────────
const defaultEppItems = [
    { item: "Protector solar (FPS 30 o más)", marca: "Suncare / Ombra", cert: "Uso Personal", talla: "—", cantidad: "1" },
    { item: "Gorro (ala ancha o legionario) con filtro UV", marca: "Genérico UV", cert: "Uso Personal", talla: "Universal", cantidad: "1" },
    { item: "Camisa o polera manga larga con filtro UV", marca: "Columbia / Genérico", cert: "UPF 30+", talla: "Por asignar", cantidad: "1" },
    { item: "Pantalón con filtro UV", marca: "Columbia / Genérico", cert: "UPF 30+", talla: "Por asignar", cantidad: "1" },
    { item: "Lentes oscuros con filtro UV", marca: "3M / Uvex", cert: "ANSI Z87.1", talla: "Universal", cantidad: "1" },
    { item: "Zapatos de seguridad o trekking", marca: "Cat / Merrell", cert: "NCh 1576", talla: "Por asignar", cantidad: "1 par" },
    { item: "Chaleco reflectante", marca: "PW Safety", cert: "ANSI/ISEA 107", talla: "M / L / XL", cantidad: "1" },
    { item: "Guantes de terreno", marca: "Assen / Towa", cert: "NCh 1585", talla: "M / L / XL", cantidad: "1 par" },
    { item: "Bálsamo labial fotoprotector", marca: "Labello / Suncare", cert: "Uso Personal", talla: "—", cantidad: "1" },
];

interface EppRow {
    item: string; marca: string; cert: string; talla: string; cantidad: string;
}

// ─── Standardized footer ────────────────────────────────────────────────────
function DocFooter({ code, version, date, page, total }: { code: string; version: string; date: string; page: number; total: number }) {
    return (
        <div className="pdf-footer">
            <span>Wirin Ambiental</span>
            <span>{code} | v{version} | {date}</span>
            <span>Pág. {page} de {total}</span>
        </div>
    );
}

export default function EPPPreview({ data }: EPPPreviewProps) {
    const P = data.projectName || "[Nombre del Proyecto]";
    const C = data.client || "[Mandante]";
    const W = data.workerName || "[Nombre del Trabajador]";
    const WR = data.workerRut || "—";
    const Resp = data.responsible || "[Responsable]";
    const D = formatDate(data.date);
    const docDate = formatDate(data.date) || new Date().toLocaleDateString("es-CL");
    const CODE = "WA-EPP-001";
    const version = "1.0";

    // Dynamic EPP table
    const [rows, setRows] = useState<EppRow[]>(defaultEppItems);
    const updateRow = (i: number, field: keyof EppRow, val: string) =>
        setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
    const addRow = () => setRows(prev => [...prev, { item: "", marca: "", cert: "", talla: "", cantidad: "1" }]);
    const removeRow = (i: number) => setRows(prev => prev.filter((_, idx) => idx !== i));

    // Worker signature + responsible signature
    const [sigWorker, setSigWorker] = useState<string | null>(null);
    const [sigResp, setSigResp] = useState<string | null>(null);
    const [sigPM, setSigPM] = useState<string | null>(null);

    return (
        <div id="epp-preview" className="pdf-document">
            <div className="pdf-page">
                <Letterhead
                    documentTitle="REGISTRO DE ENTREGA DE ELEMENTOS DE PROTECCIÓN PERSONAL (EPP)"
                    docCode={CODE} version={version} date={docDate} currentPage={1} totalPages={1}
                />

                {/* Header Info */}
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9.5pt", marginBottom: "16px" }}>
                    <tbody>
                        {[
                            ["Proyecto", P, "Mandante", C],
                            ["Nombre Trabajador", W, "RUT Trabajador", WR],
                            ["Responsable Entrega", Resp, "Fecha de Entrega", D],
                        ].map(([k1, v1, k2, v2], i) => (
                            <tr key={i}>
                                <td style={{ background: "#e8f5e9", fontWeight: 700, color: "#1B5E20", padding: "5px 10px", border: "1px solid #c8e6c9", width: "22%" }}>{k1}</td>
                                <td style={{ padding: "5px 10px", border: "1px solid #c8e6c9", width: "28%" }}>{v1}</td>
                                <td style={{ background: "#e8f5e9", fontWeight: 700, color: "#1B5E20", padding: "5px 10px", border: "1px solid #c8e6c9", width: "22%" }}>{k2}</td>
                                <td style={{ padding: "5px 10px", border: "1px solid #c8e6c9", width: "28%" }}>{v2}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Legal note */}
                <div style={{ background: "#fffde7", border: "1px solid #F9A825", borderRadius: "6px", padding: "8px 12px", fontSize: "8pt", marginBottom: "14px", color: "#37474f" }}>
                    <strong style={{ color: "#F57F17" }}>Base Legal:</strong> Art. 68 Ley N° 16.744 — El empleador debe proporcionar gratuitamente los EPP necesarios. Art. 13 DS 44 (2024) — El empleador debe proporcionar los EPP sin costo y con capacitación mínima de 1 hora cronológica.
                </div>

                {/* Dynamic EPP Table */}
                <table className="pdf-table" style={{ fontSize: "8.5pt" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "4%" }}>N°</th>
                            <th style={{ width: "28%" }}>Elemento de Protección Personal</th>
                            <th style={{ width: "18%" }}>Marca / Modelo</th>
                            <th style={{ width: "14%" }}>Certificación</th>
                            <th style={{ width: "10%" }}>Talla</th>
                            <th style={{ width: "8%" }}>Cant.</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i} style={{ height: "34px" }}>
                                <td style={{ textAlign: "center", fontWeight: 700, color: "#1B5E20", verticalAlign: "middle" }}>{i + 1}</td>
                                <td style={{ verticalAlign: "middle", padding: "2px 4px" }}>
                                    <input
                                        value={row.item}
                                        onChange={e => updateRow(i, "item", e.target.value)}
                                        placeholder="Elemento..."
                                        style={{ width: "100%", border: "none", borderBottom: "1px solid #e0e0e0", fontSize: "8pt", outline: "none", background: "transparent" }}
                                    />
                                </td>
                                <td style={{ verticalAlign: "middle", padding: "2px 4px" }}>
                                    <input value={row.marca} onChange={e => updateRow(i, "marca", e.target.value)} style={{ width: "100%", border: "none", borderBottom: "1px solid #e0e0e0", fontSize: "8pt", outline: "none", background: "transparent" }} />
                                </td>
                                <td style={{ verticalAlign: "middle", padding: "2px 4px" }}>
                                    <input value={row.cert} onChange={e => updateRow(i, "cert", e.target.value)} style={{ width: "100%", border: "none", borderBottom: "1px solid #e0e0e0", fontSize: "8pt", outline: "none", background: "transparent" }} />
                                </td>
                                <td style={{ verticalAlign: "middle", padding: "2px 4px" }}>
                                    <input value={row.talla} onChange={e => updateRow(i, "talla", e.target.value)} style={{ width: "100%", border: "none", borderBottom: "1px solid #e0e0e0", fontSize: "8pt", outline: "none", background: "transparent" }} />
                                </td>
                                <td style={{ verticalAlign: "middle", padding: "2px 4px" }}>
                                    <input value={row.cantidad} onChange={e => updateRow(i, "cantidad", e.target.value)} style={{ width: "100%", border: "none", borderBottom: "1px solid #e0e0e0", fontSize: "8pt", outline: "none", background: "transparent" }} />
                                </td>
                                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                                    <button onClick={() => removeRow(i)} title="Quitar" style={{ background: "none", border: "none", color: "#e57373", cursor: "pointer", fontSize: "11pt" }}>✕</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button
                    onClick={addRow}
                    style={{ marginTop: "6px", marginBottom: "14px", fontSize: "8pt", color: "#1B5E20", background: "#f0fdf4", border: "1px dashed #4CAF50", borderRadius: "4px", padding: "5px 14px", cursor: "pointer", display: "block" }}
                >
                    + Agregar EPP
                </button>

                {/* Declaration */}
                <div style={{ padding: "10px 14px", background: "#f0f7f0", border: "1px solid #c8e6c9", borderRadius: "6px", fontSize: "8.5pt", marginBottom: "18px" }}>
                    <strong>Declaración del Trabajador:</strong> El/La trabajador/a <strong>{W}</strong>, RUT <strong>{WR}</strong>, declara haber recibido los elementos de protección personal detallados en el presente registro, en buen estado y en cantidad suficiente. Se compromete a utilizarlos correctamente durante toda la jornada laboral en el proyecto <strong>{P}</strong>, conforme al Art. 68 de la Ley N° 16.744 y Art. 13 del DS N° 44 (2024).
                </div>

                {/* Signatures with upload */}
                <div className="pdf-signature-box">
                    <SignatureUpload label="Recibió" name={W} role={`Trabajador — RUT: ${WR}`} signatureDataUrl={sigWorker} onSignatureChange={setSigWorker} />
                    <SignatureUpload label="Entregó" name={Resp} role="Asesor SSO — Wirin Ambiental" signatureDataUrl={sigResp} onSignatureChange={setSigResp} />
                    <SignatureUpload label="Validó" name={data.projectManager || "Jefe de Proyecto"} role="Jefe de Proyecto" signatureDataUrl={sigPM} onSignatureChange={setSigPM} />
                </div>

                <DocFooter code={CODE} version={version} date={docDate} page={1} total={1} />
            </div>
        </div>
    );
}
