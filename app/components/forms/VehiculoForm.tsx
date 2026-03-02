import React from "react";

export type InspeccionEstado = "Bueno" | "Malo" | "NA" | "";

export interface VehiculoData {
    fecha: string;
    hora: string;
    patente: string;
    kilometraje: string;
    conductor: string;
    proyecto: string;
    mandante: string;
    items: Record<string, InspeccionEstado>;
    observaciones: string;
}

export const CHECKLIST_ITEMS = [
    "Luces (Altas/Bajas/Freno/Intermitentes)",
    "Neumáticos (Presión/Repuesto)",
    "Frenos",
    "Kit de Emergencia (Botiquín, Extintor)",
    "Pértiga",
    "Tracción 4x4",
    "Alarma de Retroceso",
];

interface Props {
    data: VehiculoData;
    onChange: (data: VehiculoData) => void;
}

export default function VehiculoForm({ data, onChange }: Props) {
    const handleChange = (field: keyof VehiculoData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    const handleItemChange = (item: string, value: InspeccionEstado) => {
        onChange({
            ...data,
            items: { ...data.items, [item]: value },
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-green-800 border-b border-green-100 pb-2 mb-4">
                    Datos Generales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Proyecto</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.proyecto}
                            onChange={(e) => handleChange("proyecto", e.target.value)}
                            placeholder="Ej. LAT Los Vilos - Las Palmas 220 kV"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mandante</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.mandante}
                            onChange={(e) => handleChange("mandante", e.target.value)}
                            placeholder="Ej. Transelec"
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
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hora</label>
                        <input
                            type="time"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.hora}
                            onChange={(e) => handleChange("hora", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Conductor</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.conductor}
                            onChange={(e) => handleChange("conductor", e.target.value)}
                            placeholder="Nombre completo"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Patente</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 uppercase"
                                value={data.patente}
                                onChange={(e) => handleChange("patente", e.target.value.toUpperCase())}
                                placeholder="AB-CD-12"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kilometraje</label>
                            <input
                                type="number"
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                value={data.kilometraje}
                                onChange={(e) => handleChange("kilometraje", e.target.value)}
                                placeholder="000000"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-green-800 border-b border-green-100 pb-2 mb-4">
                    Checklist de Inspección
                </h2>
                <div className="space-y-4">
                    {CHECKLIST_ITEMS.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                            <span className="text-sm font-medium text-gray-800 mb-2 sm:mb-0">{item}</span>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`item-${idx}`}
                                        checked={data.items[item] === "Bueno"}
                                        onChange={() => handleItemChange(item, "Bueno")}
                                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-xs font-semibold text-green-700">Bueno</span>
                                </label>
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`item-${idx}`}
                                        checked={data.items[item] === "Malo"}
                                        onChange={() => handleItemChange(item, "Malo")}
                                        className="w-4 h-4 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-xs font-semibold text-red-700">Malo</span>
                                </label>
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`item-${idx}`}
                                        checked={data.items[item] === "NA"}
                                        onChange={() => handleItemChange(item, "NA")}
                                        className="w-4 h-4 text-gray-500 focus:ring-gray-500"
                                    />
                                    <span className="text-xs font-semibold text-gray-600">N/A</span>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-green-800 border-b border-green-100 pb-2 mb-4">
                    Observaciones
                </h2>
                <div>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[100px]"
                        value={data.observaciones}
                        onChange={(e) => handleChange("observaciones", e.target.value)}
                        placeholder="Ingrese cualquier observación detectada durante la inspección..."
                    />
                </div>
            </div>
        </div>
    );
}
