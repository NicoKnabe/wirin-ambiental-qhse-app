"use client";

import { useEffect, useState } from "react";

export interface ASTStep {
    id: string;
    sequence: string;
    hazards: string;
    controls: string;
}

export interface ASTWorker {
    id: string;
    name: string;
    rut: string;
    role: string;
}

export const AST_PPE_LIST = [
    "Casco", "Lentes UV", "Legión", "Zapatos de Seguridad",
    "Chaleco Reflectante", "Bloqueador Solar", "Guantes"
];

export interface ASTData {
    projectName: string;
    location: string;
    date: string;
    startTime: string;
    endTime: string;
    client: string;
    task: string;
    steps: ASTStep[];
    ppe: { [key: string]: boolean };
    workers: ASTWorker[];
    supervisorName: string;
    ssoName: string;
}

interface ASTFormProps {
    data: ASTData;
    onChange: (data: ASTData) => void;
}

export default function ASTForm({ data, onChange }: ASTFormProps) {
    const update = (field: keyof ASTData, value: any) => onChange({ ...data, [field]: value });

    const addStep = () => {
        update("steps", [
            ...data.steps,
            { id: Date.now().toString(), sequence: "", hazards: "", controls: "" }
        ]);
    };

    const removeStep = (id: string) => {
        update("steps", data.steps.filter(s => s.id !== id));
    };

    const updateStep = (id: string, field: keyof ASTStep, value: string) => {
        update("steps", data.steps.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const addWorker = () => {
        update("workers", [
            ...data.workers,
            { id: Date.now().toString(), name: "", rut: "", role: "" }
        ]);
    };

    const removeWorker = (id: string) => {
        update("workers", data.workers.filter(w => w.id !== id));
    };

    const updateWorker = (id: string, field: keyof ASTWorker, value: string) => {
        update("workers", data.workers.map(w => w.id === id ? { ...w, [field]: value } : w));
    };

    const togglePpe = (item: string) => {
        update("ppe", {
            ...data.ppe,
            [item]: !data.ppe[item]
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-800 to-red-600 text-white rounded-xl p-4 mb-6">
                <h3 className="font-bold text-sm uppercase tracking-widest mb-1">
                    ⚠️ Análisis Seguro de Trabajo (AST)
                </h3>
                <p className="text-xs opacity-90">
                    Formulario dinámico de terreno para evaluación diaria de riesgos
                </p>
            </div>

            {/* SECCIÓN 1: Datos Generales */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
                <h4 className="font-bold text-wirin-olive text-sm uppercase border-b pb-2">1. Datos Generales</h4>
                <div className="form-group">
                    <label className="form-label">Nombre del Proyecto</label>
                    <input type="text" className="form-input" value={data.projectName} onChange={e => update("projectName", e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Empresa Mandante</label>
                    <input type="text" className="form-input" value={data.client} onChange={e => update("client", e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Lugar / Ubicación</label>
                    <input type="text" className="form-input" value={data.location} onChange={e => update("location", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                        <label className="form-label">Fecha</label>
                        <input type="date" className="form-input" value={data.date} onChange={e => update("date", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">H. Inicio</label>
                        <input type="time" className="form-input" value={data.startTime} onChange={e => update("startTime", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">H. Término</label>
                        <input type="time" className="form-input" value={data.endTime} onChange={e => update("endTime", e.target.value)} />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Tarea Específica a realizar</label>
                    <input type="text" className="form-input" value={data.task} onChange={e => update("task", e.target.value)} />
                </div>
            </div>

            {/* SECCIÓN 2: Análisis Paso a Paso */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b pb-2">
                    <h4 className="font-bold text-wirin-olive text-sm uppercase">2. Análisis Paso a Paso</h4>
                    <button onClick={addStep} className="text-xs bg-wirin-green text-white px-3 py-1.5 rounded-md font-bold hover:bg-wirin-green-dark transition">
                        + Agregar Paso
                    </button>
                </div>
                {data.steps.map((step, idx) => (
                    <div key={step.id} className="relative bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="absolute top-2 right-2 flex gap-2">
                            <span className="text-xs font-bold text-gray-400">Paso {idx + 1}</span>
                            <button onClick={() => removeStep(step.id)} className="text-red-500 hover:text-red-700 text-xs px-1">✕</button>
                        </div>
                        <div className="space-y-3 mt-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Secuencia del Trabajo (¿Qué se va a hacer?)</label>
                                <textarea className="form-input text-sm p-2 w-full h-16 resize-none" value={step.sequence} onChange={e => updateStep(step.id, "sequence", e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-red-600 uppercase">Peligros / Riesgos (¿Qué puede salir mal?)</label>
                                <textarea className="form-input text-sm p-2 w-full h-16 resize-none" value={step.hazards} onChange={e => updateStep(step.id, "hazards", e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-wirin-green-dark uppercase">Medidas de Control (¿Cómo lo evitamos?)</label>
                                <textarea className="form-input text-sm p-2 w-full h-16 resize-none" value={step.controls} onChange={e => updateStep(step.id, "controls", e.target.value)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* SECCIÓN 3: Equipo de Protección Personal */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4 shadow-sm">
                <h4 className="font-bold text-wirin-olive text-sm uppercase border-b pb-2">3. EPP Obligatorios</h4>
                <div className="grid grid-cols-2 gap-2">
                    {AST_PPE_LIST.map(item => (
                        <label key={item} className="flex items-center gap-2 cursor-pointer text-sm">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-wirin-green rounded border-gray-300 focus:ring-wirin-green"
                                checked={!!data.ppe[item]}
                                onChange={() => togglePpe(item)}
                            />
                            {item}
                        </label>
                    ))}
                </div>
            </div>

            {/* SECCIÓN 4: Participantes */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b pb-2">
                    <h4 className="font-bold text-wirin-olive text-sm uppercase">4. Trabajadores (Firmantes)</h4>
                    <button onClick={addWorker} className="text-xs bg-wirin-green text-white px-3 py-1.5 rounded-md font-bold hover:bg-wirin-green-dark transition">
                        + Agregar
                    </button>
                </div>
                {data.workers.map((worker, idx) => (
                    <div key={worker.id} className="relative bg-gray-50 p-3 rounded-lg border border-gray-200 grid grid-cols-1 gap-2">
                        <button onClick={() => removeWorker(worker.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs p-1">✕</button>
                        <span className="text-xs font-bold text-gray-400">Trabajador {idx + 1}</span>
                        <input className="form-input text-sm p-2" placeholder="Nombre completo" value={worker.name} onChange={e => updateWorker(worker.id, "name", e.target.value)} />
                        <div className="grid grid-cols-2 gap-2">
                            <input className="form-input text-sm p-2" placeholder="RUT" value={worker.rut} onChange={e => updateWorker(worker.id, "rut", e.target.value)} />
                            <input className="form-input text-sm p-2" placeholder="Cargo" value={worker.role} onChange={e => updateWorker(worker.id, "role", e.target.value)} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Cierre: Responsables */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4 shadow-sm">
                <h4 className="font-bold text-wirin-olive text-sm uppercase border-b pb-2">Cierre</h4>
                <div className="form-group">
                    <label className="form-label">Supervisor a Cargo</label>
                    <input type="text" className="form-input" value={data.supervisorName} onChange={e => update("supervisorName", e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Asesor SSO</label>
                    <input type="text" className="form-input" value={data.ssoName} onChange={e => update("ssoName", e.target.value)} />
                </div>
            </div>
        </div>
    );
}
