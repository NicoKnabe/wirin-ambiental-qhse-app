import React from "react";

export interface ODIData {
    fecha: string;
    nombres: string;
    rut: string;
    cargo: string;
    proyecto: string;
    empresa: string;
}

interface Props {
    data: ODIData;
    onChange: (data: ODIData) => void;
}


export default function ODIForm({ data, onChange }: Props) {
    const handleChange = (field: keyof ODIData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-green-800 border-b border-green-100 pb-2 mb-4">
                    Datos del Trabajador
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombres y Apellidos</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.nombres}
                            onChange={(e) => handleChange("nombres", e.target.value)}
                            placeholder="Ej. Juan Pérez"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">RUT</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.rut}
                            onChange={(e) => handleChange("rut", e.target.value)}
                            placeholder="12.345.678-9"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cargo</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.cargo}
                            onChange={(e) => handleChange("cargo", e.target.value)}
                            placeholder="Ej. Especialista en Medio Biótico"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-green-800 border-b border-green-100 pb-2 mb-4">
                    Datos de Empleador / Proyecto
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Empresa</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.empresa}
                            onChange={(e) => handleChange("empresa", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Proyecto</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.proyecto}
                            onChange={(e) => handleChange("proyecto", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fecha</label>
                        <input
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.fecha}
                            onChange={(e) => handleChange("fecha", e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
