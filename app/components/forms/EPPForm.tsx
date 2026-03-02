"use client";

export interface EPPData {
    projectName: string;
    workerName: string;
    workerRut: string;
    responsible: string;
    date: string;
    client: string;
    projectManager: string;
}

interface EPPFormProps {
    data: EPPData;
    onChange: (data: EPPData) => void;
}

export default function EPPForm({ data, onChange }: EPPFormProps) {
    const update = (field: keyof EPPData, value: string) =>
        onChange({ ...data, [field]: value });

    return (
        <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-700 to-wirin-yellow text-white rounded-xl p-4 mb-6">
                <h3 className="font-bold text-sm uppercase tracking-widest mb-1">
                    🦺 Registro de Entrega de EPP
                </h3>
                <p className="text-xs opacity-90">
                    Registro formal de elementos de protección personal entregados al trabajador
                </p>
            </div>

            <div className="form-group">
                <label className="form-label">Nombre del Proyecto</label>
                <input type="text" className="form-input" placeholder="Nombre del proyecto" value={data.projectName} onChange={(e) => update("projectName", e.target.value)} />
            </div>
            <div className="form-group">
                <label className="form-label">Mandante</label>
                <input type="text" className="form-input" placeholder="Empresa mandante" value={data.client} onChange={(e) => update("client", e.target.value)} />
            </div>
            <div className="form-group">
                <label className="form-label">Nombre del Trabajador</label>
                <input type="text" className="form-input" placeholder="Nombre completo" value={data.workerName} onChange={(e) => update("workerName", e.target.value)} />
            </div>
            <div className="form-group">
                <label className="form-label">RUT Trabajador</label>
                <input type="text" className="form-input" placeholder="Ej: 12.345.678-9" value={data.workerRut} onChange={(e) => update("workerRut", e.target.value)} />
            </div>
            <div className="form-group">
                <label className="form-label">Responsable de Entrega</label>
                <input type="text" className="form-input" placeholder="Nombre del Asesor SSO" value={data.responsible} onChange={(e) => update("responsible", e.target.value)} />
            </div>
            <div className="form-group">
                <label className="form-label">Jefe de Proyecto</label>
                <input type="text" className="form-input" placeholder="Nombre del Jefe de Proyecto" value={data.projectManager} onChange={(e) => update("projectManager", e.target.value)} />
            </div>
            <div className="form-group">
                <label className="form-label">Fecha de Entrega</label>
                <input type="date" className="form-input" value={data.date} onChange={(e) => update("date", e.target.value)} />
            </div>
        </div>
    );
}
