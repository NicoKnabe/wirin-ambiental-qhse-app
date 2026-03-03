import React from 'react';

export interface InvestigacionData {
    fecha: string;
    hora: string;
    supervisor: string;
    asesor: string;
    descripcion: string;
    evidencias: string;
    ishikawa: {
        manoObra: string;
        maquinaria: string;
        metodos: string;
        materiales: string;
        medioAmbiente: string;
        medicion: string;
    };
    planAccion: Array<{ medida: string; responsable: string; plazo: string }>;
    elaboratedBy: string;
    elaboratedRole: string;
    reviewedBy: string;
    reviewedRole: string;
    approvedBy: string;
    approvedRole: string;
}

interface Props {
    data: InvestigacionData;
    onChange: (data: InvestigacionData) => void;
}

export default function InvestigacionForm({ data, onChange }: Props) {
    const update = (field: keyof InvestigacionData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const updateIshikawa = (field: keyof InvestigacionData['ishikawa'], value: string) => {
        onChange({ ...data, ishikawa: { ...data.ishikawa, [field]: value } });
    };

    const addAction = () => {
        onChange({ ...data, planAccion: [...data.planAccion, { medida: "", responsable: "", plazo: "" }] });
    };

    const updateAction = (index: number, field: "medida" | "responsable" | "plazo", value: string) => {
        const newPlan = [...data.planAccion];
        newPlan[index][field] = value;
        onChange({ ...data, planAccion: newPlan });
    };

    const removeAction = (index: number) => {
        onChange({ ...data, planAccion: data.planAccion.filter((_, i) => i !== index) });
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <h3 className="font-bold text-sm text-blue-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">📋</span> Datos Generales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                        <label className="form-label">Fecha del Incidente</label>
                        <input type="date" className="form-input" value={data.fecha} onChange={(e) => update("fecha", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Hora del Incidente</label>
                        <input type="time" className="form-input" value={data.hora} onChange={(e) => update("hora", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Supervisor Involucrado / A cargo</label>
                        <input type="text" className="form-input" placeholder="Nombre del Supervisor" value={data.supervisor} onChange={(e) => update("supervisor", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Asesor SSO</label>
                        <input type="text" className="form-input" placeholder="Nombre del Asesor" value={data.asesor} onChange={(e) => update("asesor", e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h3 className="font-bold text-sm text-gray-800 mb-4">Descripción y Evidencias</h3>
                <div className="space-y-4">
                    <div className="form-group">
                        <label className="form-label">Descripción del Incidente</label>
                        <textarea className="form-input min-h-[100px]" placeholder="Relato de los hechos..." value={data.descripcion} onChange={(e) => update("descripcion", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Evidencias / Testimonios</label>
                        <textarea className="form-input min-h-[80px]" placeholder="Declaraciones, fotografías (descritas), etc." value={data.evidencias} onChange={(e) => update("evidencias", e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                <h3 className="font-bold text-sm text-orange-900 mb-2 flex items-center gap-2">
                    <span className="text-xl">🐟</span> Análisis Causa Raíz (Ishikawa - 6M)
                </h3>
                <p className="text-xs text-orange-700 mb-4">Identifique las causas principales en cada categoría. Deje en blanco si no aplica.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label className="form-label">Mano de Obra</label>
                        <textarea className="form-input" rows={2} placeholder="Falta de capacitación, fatiga, etc." value={data.ishikawa.manoObra} onChange={(e) => updateIshikawa("manoObra", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Maquinaria</label>
                        <textarea className="form-input" rows={2} placeholder="Falla mecánica, falta de mantención..." value={data.ishikawa.maquinaria} onChange={(e) => updateIshikawa("maquinaria", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Métodos</label>
                        <textarea className="form-input" rows={2} placeholder="Procedimientos inadecuados, falta de AST..." value={data.ishikawa.metodos} onChange={(e) => updateIshikawa("metodos", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Materiales</label>
                        <textarea className="form-input" rows={2} placeholder="Material defectuoso, insumos incorrectos..." value={data.ishikawa.materiales} onChange={(e) => updateIshikawa("materiales", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Medio Ambiente</label>
                        <textarea className="form-input" rows={2} placeholder="Clima adverso, terreno inestable..." value={data.ishikawa.medioAmbiente} onChange={(e) => updateIshikawa("medioAmbiente", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Medición</label>
                        <textarea className="form-input" rows={2} placeholder="Instrumentos descalibrados, errores de lectura..." value={data.ishikawa.medicion} onChange={(e) => updateIshikawa("medicion", e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm text-green-900 flex items-center gap-2">
                        <span className="text-xl">✅</span> Plan de Acción (Medidas Correctivas)
                    </h3>
                    <button onClick={addAction} className="btn-secondary text-xs py-1">
                        + Añadir Medida
                    </button>
                </div>

                <div className="space-y-3">
                    {data.planAccion.map((accion, i) => (
                        <div key={i} className="flex gap-2 items-start bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex-1 space-y-2">
                                <input type="text" className="form-input" placeholder="Medida Correctiva / Preventiva" value={accion.medida} onChange={(e) => updateAction(i, "medida", e.target.value)} />
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="text" className="form-input" placeholder="Responsable" value={accion.responsable} onChange={(e) => updateAction(i, "responsable", e.target.value)} />
                                    <input type="date" className="form-input" value={accion.plazo} onChange={(e) => updateAction(i, "plazo", e.target.value)} />
                                </div>
                            </div>
                            <button onClick={() => removeAction(i)} className="text-red-500 hover:text-red-700 p-2">
                                ×
                            </button>
                        </div>
                    ))}
                    {data.planAccion.length === 0 && (
                        <div className="text-center text-sm text-gray-500 py-4 bg-white rounded border border-dashed border-gray-300">
                            No hay medidas registradas. Añade una medida correctiva.
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
                <p className="form-label mb-3" style={{ fontSize: "11px", color: "#1B5E20" }}>
                    ✍️ Tabla de Firmas (Configuración)
                </p>
                {[
                    { label: "Elaboró", nameKey: "elaboratedBy" as keyof InvestigacionData, roleKey: "elaboratedRole" as keyof InvestigacionData },
                    { label: "Revisó", nameKey: "reviewedBy" as keyof InvestigacionData, roleKey: "reviewedRole" as keyof InvestigacionData },
                    { label: "Aprobó", nameKey: "approvedBy" as keyof InvestigacionData, roleKey: "approvedRole" as keyof InvestigacionData },
                ].map(({ label, nameKey, roleKey }) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-3 mb-2">
                        <p className="text-xs font-bold text-wirin-olive uppercase mb-2">{label}</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="form-label" style={{ fontSize: "10px" }}>Nombre</label>
                                <input type="text" className="form-input text-xs py-1" placeholder="Nombre completo" value={data[nameKey] as string} onChange={(e) => update(nameKey, e.target.value)} />
                            </div>
                            <div>
                                <label className="form-label" style={{ fontSize: "10px" }}>Cargo</label>
                                <input type="text" className="form-input text-xs py-1" placeholder="Cargo" value={data[roleKey] as string} onChange={(e) => update(roleKey, e.target.value)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
