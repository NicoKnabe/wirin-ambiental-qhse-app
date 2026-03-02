"use client";

import { useState } from "react";
import Letterhead from "../Letterhead";
import { ASTData, AST_PPE_LIST } from "../forms/ASTForm";
import SignatureUpload from "../SignatureUpload";

interface ASTPreviewProps { data: ASTData; }

function DocFooter({ code, version, date, page, total }: { code: string; version: string; date: string; page: number; total: number }) {
    return (
        <div className="pdf-footer">
            <span>Wirin Ambiental</span>
            <span>{code} | v{version} | {date}</span>
        </div>
    );
}

export default function ASTPreview({ data }: ASTPreviewProps) {
    const CODE = "WA-AST-001";
    const version = "01";
    const docDate = data.date ? new Date(data.date + "T12:00:00").toLocaleDateString("es-CL") : "[Fecha]";

    // State for signatures
    const [workerSigs, setWorkerSigs] = useState<Record<string, string | null>>({});
    const [supSig, setSupSig] = useState<string | null>(null);
    const [ssoSig, setSsoSig] = useState<string | null>(null);

    const updateWorkerSig = (id: string, val: string | null) => setWorkerSigs(p => ({ ...p, [id]: val }));

    return (
        <div className="pdf-document" id="ast-preview" style={{ background: "#e5e7eb", padding: "40px 0" }}>
            <div className="pdf-page">
                <Letterhead
                    documentTitle="REGISTRO ANÁLISIS SEGURO DE TRABAJO (AST)"
                    docCode={CODE}
                    version={version}
                    date={docDate}
                    currentPage={1}
                    totalPages={1}
                />

                {/* 1. Datos Generales */}
                <div className="pdf-section-title" style={{ marginTop: 0 }}>1. Datos Generales</div>
                <table className="pdf-table">
                    <tbody>
                        <tr>
                            <td style={{ fontWeight: 600, width: "20%" }}>Proyecto</td>
                            <td style={{ width: "30%" }}>{data.projectName || "[P]"}</td>
                            <td style={{ fontWeight: 600, width: "20%" }}>Mandante</td>
                            <td style={{ width: "30%" }}>{data.client || "[C]"}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 600 }}>Ubicación</td>
                            <td>{data.location || "[L]"}</td>
                            <td style={{ fontWeight: 600 }}>Fecha</td>
                            <td>{docDate}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 600 }}>Hora Inicio</td>
                            <td>{data.startTime || "[HH:MM]"}</td>
                            <td style={{ fontWeight: 600 }}>Hora Término</td>
                            <td>{data.endTime || "[HH:MM]"}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 600 }}>Tarea Específica</td>
                            <td colSpan={3}>{data.task || "[T]"}</td>
                        </tr>
                    </tbody>
                </table>

                {/* 2. Análisis Paso a Paso */}
                <div className="pdf-section-title break-before-page">2. Análisis Paso a Paso</div>
                <table className="pdf-table">
                    <thead>
                        <tr>
                            <th style={{ width: "6%" }}>N°</th>
                            <th style={{ width: "28%" }}>Secuencia del Trabajo</th>
                            <th style={{ width: "28%" }}>Peligros / Riesgos</th>
                            <th style={{ width: "38%" }}>Medidas de Control</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.steps.length === 0 ? (
                            <tr><td colSpan={4} style={{ textAlign: "center", fontStyle: "italic", color: "#9ca3af" }}>Agrega pasos en el formulario...</td></tr>
                        ) : (
                            data.steps.map((step, idx) => (
                                <tr key={step.id}>
                                    <td style={{ textAlign: "center", fontWeight: 700 }}>{idx + 1}</td>
                                    <td style={{ fontSize: "8pt" }}>{step.sequence}</td>
                                    <td style={{ fontSize: "8pt", color: "#c62828" }}>{step.hazards}</td>
                                    <td style={{ fontSize: "8pt", color: "#1B5E20" }}>{step.controls}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* 3. EPP Obligatorios */}
                <div className="pdf-section-title break-before-page">3. Equipo de Protección Personal (EPP)</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", border: "1px solid #c8e6c9", padding: "12px", background: "#f0f7f0" }}>
                    {AST_PPE_LIST.map(item => (
                        <div key={item} style={{ fontSize: "8.5pt", display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontSize: "12pt", color: data.ppe[item] ? "#1B5E20" : "#9ca3af" }}>
                                {data.ppe[item] ? "☑" : "☐"}
                            </span>
                            {item}
                        </div>
                    ))}
                </div>

                {/* 4. Participantes y Firmas */}
                <div className="pdf-section-title break-before-page">4. Registro de Participantes y Firmas</div>
                <table className="pdf-table">
                    <thead>
                        <tr>
                            <th style={{ width: "30%" }}>Nombre Completo</th>
                            <th style={{ width: "15%" }}>RUT</th>
                            <th style={{ width: "25%" }}>Cargo / Especialidad</th>
                            <th style={{ width: "30%" }}>Firma Digital</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.workers.length === 0 ? (
                            <tr><td colSpan={4} style={{ textAlign: "center", fontStyle: "italic", color: "#9ca3af" }}>Agrega trabajadores en el formulario...</td></tr>
                        ) : (
                            data.workers.map(w => (
                                <tr key={w.id}>
                                    <td style={{ verticalAlign: "middle", fontWeight: 600 }}>{w.name}</td>
                                    <td style={{ verticalAlign: "middle", textAlign: "center", fontSize: "8pt" }}>{w.rut}</td>
                                    <td style={{ verticalAlign: "middle", fontSize: "8pt" }}>{w.role}</td>
                                    <td style={{ verticalAlign: "middle", padding: "4px" }}>
                                        <div style={{ transform: "scale(0.85)", transformOrigin: "center left", width: "115%" }}>
                                            <SignatureUpload
                                                label=""
                                                name=""
                                                role=""
                                                signatureDataUrl={workerSigs[w.id] || null}
                                                onSignatureChange={(val) => updateWorkerSig(w.id, val)}
                                                small
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* 5. Cierre y Aprobación */}
                <div className="pdf-signature-box break-before-page" style={{ gridTemplateColumns: "1fr 1fr", gap: "40px", marginTop: "40px" }}>
                    <div style={{ textAlign: "center" }}>
                        <SignatureUpload
                            label="Supervisor a Cargo"
                            name={data.supervisorName || "Nombre del Supervisor"}
                            role="Responsable de Terreno"
                            signatureDataUrl={supSig}
                            onSignatureChange={setSupSig}
                        />
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <SignatureUpload
                            label="Asesor SSO / Prevencionista"
                            name={data.ssoName || "Nombre Asesor SSO"}
                            role="Aprobación Técnica"
                            signatureDataUrl={ssoSig}
                            onSignatureChange={setSsoSig}
                        />
                    </div>
                </div>

                <DocFooter code={CODE} version={version} date={docDate} page={1} total={1} />
            </div>
        </div>
    );
}
