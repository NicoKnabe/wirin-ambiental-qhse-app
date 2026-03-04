import { useState, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── DATA ESTÁTICA POR DEFECTO (PLANTILLA BASE HTML MATRIZ_IPER_DS44) ────────
export const MATRIZ_BASE = {
    filas: [
        {
            actividad: "Desplazamiento Pedestre\n(Recorrido)",
            peligro: "🌞 Radiación solar térmica y UV",
            riesgo: "Exposición a radiación UV / Quemaduras, deshidratación, cáncer a la piel.",
            riesgo_puro: { p: 12, c: 2, mr: 24, nivel: "Moderado" },
            controles: [
                { tipo: "Administración", medida: "Evitar exposición cerca del mediodía; realizar actividades bajo sombra si es posible; hidratación constante mínima 250 ml/hora." },
                { tipo: "EPP", medida: "Bloqueador solar FPS +50 (reaplicar c/2 h); gorro legionario con filtro UV; ropa manga larga con filtro UV (UPF ≥ 40); lentes oscuros con filtro UV." }
            ],
            riesgo_residual: { p: 4, c: 1, mr: 4, nivel: "Aceptable" },
            legal: ["Ley 16.744", "Ley 20.096 (Radiación UV)", "DS 594 Art. 109"]
        },
        {
            actividad: "Desplazamiento Pedestre\n(Recorrido)",
            peligro: "⚠️ Superficies irregulares, con pendiente o mojadas",
            riesgo: "Caída a mismo nivel / Fracturas, esguinces, contusiones.",
            riesgo_puro: { p: 12, c: 2, mr: 24, nivel: "Moderado" },
            controles: [
                { tipo: "Administración", medida: "Caminar con pasos firmes y lentos; evitar caminos resbalosos o con pendiente pronunciada; apoyarse con bastón en pendientes; desplazamiento en grupo." },
                { tipo: "EPP", medida: "Uso obligatorio de calzado de seguridad antideslizante tipo trekking con suela dentada; polaina en terreno de vegetación densa." }
            ],
            riesgo_residual: { p: 4, c: 2, mr: 8, nivel: "Aceptable" },
            legal: ["Ley 16.744", "DS 594 Art. 6", "DS 44 Jerarquía de Controles"]
        },
        {
            actividad: "Desplazamiento Pedestre\n(Recorrido)",
            peligro: "🎒 Manejo manual de cargas (mochilas/equipos)",
            riesgo: "Sobreesfuerzo físico / Trastornos musculoesqueléticos (lumbalgia, tendinitis).",
            riesgo_puro: { p: 12, c: 2, mr: 24, nivel: "Moderado" },
            controles: [
                { tipo: "Administración", medida: "Distribuir peso máximo de 25 kg (hombres) y 20 kg (mujeres); pausas activas de 5 min cada 30 min; mantener espalda recta al elevar cargas; rotación de carga entre el equipo." },
                { tipo: "EPP", medida: "Uso obligatorio de mochilas ergonómicas con soporte lumbar y cinturón de cadera; faja lumbar en caso de cargas sobre 15 kg." }
            ],
            riesgo_residual: { p: 4, c: 1, mr: 4, nivel: "Aceptable" },
            legal: ["Ley 20.001 (Manejo Manual de Carga)", "Ley 20.949 (Ley del Saco)", "DS 63 (Reglamento Ley 20.001)"]
        },
        {
            actividad: "Desplazamiento Pedestre\n(Recorrido)",
            peligro: "🚗 Tránsito de vehículos por el área de estudio",
            riesgo: "Atropello / Fracturas, TEC, muerte.",
            riesgo_puro: { p: 8, c: 3, mr: 24, nivel: "Moderado" },
            controles: [
                { tipo: "Administración", medida: "Mantener atención en zonas de tránsito; evitar cruzar carreteras en curvas o sectores sin visibilidad; coordinar con jefe de terreno antes de cruzar vías; preferir zonas habilitadas para peatones." },
                { tipo: "EPP", medida: "Uso obligatorio de chaleco reflectante certificado (clase II mínimo) y luminaria corporal en condiciones de baja visibilidad o trabajo nocturno." }
            ],
            riesgo_residual: { p: 4, c: 3, mr: 12, nivel: "Aceptable" },
            legal: ["Ley 16.744", "Ley 18.290 (Ley de Tránsito)", "DS 44 Art. 20"]
        },
        {
            actividad: "Desplazamiento Pedestre\n(Recorrido)",
            peligro: "🌿 Flora silvestre (espinas, alergenos)",
            riesgo: "Contacto con flora / Reacciones alérgicas, heridas cortopunzantes, dermatitis de contacto.",
            riesgo_puro: { p: 12, c: 1, mr: 12, nivel: "Aceptable" },
            controles: [
                { tipo: "Administración", medida: "Identificación previa del entorno florístico de riesgo; briefing al equipo sobre especies de riesgo (quillay, quisco, litre); botiquín con antihistamínicos y corticoides tópicos." },
                { tipo: "EPP", medida: "Ropa de trabajo que cubra completamente brazos y piernas; guantes de cuero o anticorte resistentes; calzado cerrado tipo trekking; polaina en matorrales densos." }
            ],
            riesgo_residual: { p: 4, c: 1, mr: 4, nivel: "Aceptable" },
            legal: ["Ley 16.744", "DS 594 Art. 7 y 8", "DS 44 Jerarquía de Controles"]
        },
        {
            actividad: "Instalación de Trampas / Muestreo",
            peligro: "🦎 Fauna silvestre, insectos y vectores biológicos",
            riesgo: "Contacto con fauna / Shock anafiláctico, infecciones zoonóticas, mordeduras, picaduras.",
            riesgo_puro: { p: 12, c: 3, mr: 36, nivel: "Substancial" },
            controles: [
                { tipo: "Administración", medida: "Procedimiento específico de manipulación de fauna; precaución al revisar madrigueras y huecos; no manipular animales con mano desnuda; desinfección de trampas antes y después de uso; revisar ropa y calzado al regresar; protocolo de emergencia para anafilaxis (adrenalina autoinyectable en botiquín)." },
                { tipo: "EPP", medida: "Guantes de cuero o nitrilo reforzados; mascarilla FFP2 en manipulación de trampas; repelente de insectos DEET ≥ 20%; polaina y ropa de manga larga; revisión de garrapatas post-actividad." }
            ],
            riesgo_residual: { p: 4, c: 2, mr: 8, nivel: "Aceptable" },
            legal: ["Ley 16.744", "DS 594 Párrafo III (Agentes Biológicos)", "DS 44 Art. 14", "Protocolos MINSAL Zoonosis"]
        },
        {
            actividad: "Monitoreo Nocturno",
            peligro: "🌑 Ausencia de luz natural / Bajas temperaturas",
            riesgo: "Caídas, golpes con objetos, hipotermia moderada / Fracturas, contusiones, hipotermia.",
            riesgo_puro: { p: 12, c: 2, mr: 24, nivel: "Moderado" },
            controles: [
                { tipo: "Administración", medida: "Verificación previa de iluminación personal y de respaldo; no alejarse del vehículo en solitario; comunicación cada 30 min con base/supervisor; evitar exposición prolongada al frío; horario máximo de monitoreo nocturno definido en procedimiento." },
                { tipo: "EPP", medida: "Linterna frontal LED con batería de respaldo; chaleco reflectante; vestimenta térmica en tres capas (base térmica, polar, cortaviento impermeable); guantes térmicos; gorro tipo balaclaava; calzado impermeable aislante." }
            ],
            riesgo_residual: { p: 4, c: 1, mr: 4, nivel: "Aceptable" },
            legal: ["Ley 16.744", "DS 594 Art. 96–99 (Exposición al Frío)", "DS 44 Art. 20", "Ley 19.404 (Trabajo Nocturno)"]
        },
        {
            actividad: "Conducción Vehicular\n(Traslados)",
            peligro: "🚙 Conducción en ruta y laderas (off-road / camino rural)",
            riesgo: "Choque, colisión, volcamiento / Lesiones graves, TEC, muerte.",
            riesgo_puro: { p: 12, c: 3, mr: 36, nivel: "Substancial" },
            controles: [
                { tipo: "Ingeniería", medida: "Barra antivuelco certificada (jaula Roll-Bar) en camionetas; kit airbag activo; neumáticos con DOT vigente y banda de rodado adecuada a terreno; sistema de comunicación satelital." },
                { tipo: "Administración", medida: "Licencia de conducir vigente y habilitada para la categoría del vehículo; check list diario pre-operacional (Formulario DS 44); velocidad máxima 40 km/h en caminos no pavimentados; prohibido uso de celular mientras se conduce; manejo a la defensiva; límite de conducción continua 2 h (pausa mínima 15 min); política alcohol cero; comunicación de ruta al supervisor antes de partir." },
                { tipo: "EPP", medida: "Cinturón de seguridad obligatorio para todos los ocupantes; casco en zonas de riesgo de proyección si aplica; chaleco reflectante al bajarse del vehículo en ruta." }
            ],
            riesgo_residual: { p: 4, c: 3, mr: 12, nivel: "Aceptable" },
            legal: ["Ley 16.744", "Ley 18.290 (Ley de Tránsito)", "DS 44 Art. 22 (Conducción)", "NCh 2439 (Vehículos Livianos)", "Res. Ex. N°156 (Check List Vehíc.)"]
        }
    ]
};

// ─── HELPERS DE COLORES Y ETIQUETAS ──────────────────────────────────────────
const NIVEL_COLORS = {
    Substancial: { bg: "#fde8e8", text: "#c0392b", border: "#e74c3c", badge: "#c0392b" },
    Moderado: { bg: "#fef3e2", text: "#e67e22", border: "#f39c12", badge: "#e67e22" },
    Aceptable: { bg: "#e8f8f0", text: "#27ae60", border: "#2ecc71", badge: "#27ae60" },
};

const TIPO_COLORS = {
    "Ingeniería": { bg: "#2980b9", label: "ING" },
    "Administración": { bg: "#8e44ad", label: "ADM" },
    "EPP": { bg: "#16a085", label: "EPP" },
};

function NivelBadge({ nivel, mr, p, c }) {
    const col = NIVEL_COLORS[nivel] || NIVEL_COLORS.Aceptable;
    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 3 }}>
                P: <b>{p}</b> × C: <b>{c}</b>
            </div>
            <div style={{
                fontSize: 20, fontWeight: 900, color: col.text, lineHeight: 1,
            }}>{mr}</div>
            <span style={{
                display: "inline-block", marginTop: 4,
                background: col.badge, color: "#fff",
                borderRadius: 20, padding: "2px 10px",
                fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
                textTransform: "uppercase",
            }}>{nivel}</span>
        </div>
    );
}

function CtrlTag({ tipo }) {
    const t = TIPO_COLORS[tipo] || { bg: "#555", label: tipo.slice(0, 3).toUpperCase() };
    return (
        <span style={{
            background: t.bg, color: "#fff",
            borderRadius: 3, padding: "1px 6px",
            fontSize: 8.5, fontWeight: 700,
            whiteSpace: "nowrap", flexShrink: 0, marginTop: 1,
        }}>{t.label}</span>
    );
}

// ─── COMPONENTE PRINCIPAL IPER STATIC + LOCAL PDF ────────────────────────────
export default function IPERModule() {
    const today = new Date().toISOString().split("T")[0];
    const [proyecto, setProyecto] = useState("");
    const [mandante, setMandante] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [fecha, setFecha] = useState(today);

    const iperData = {
        proyecto: proyecto || "Proyecto Estudio Base",
        mandante: mandante,
        ubicacion: ubicacion,
        fecha: fecha,
        filas: MATRIZ_BASE.filas
    };

    // === LÓGICA DE AGRUPACIÓN (ROWSPAN) ===
    const filasAgrupadas = iperData.filas.map((fila, index, array) => {
        let isFirstOfGroup = false;
        let rowSpanCount = 1;

        if (index === 0 || fila.actividad !== array[index - 1].actividad) {
            isFirstOfGroup = true;
            for (let i = index + 1; i < array.length; i++) {
                if (array[i].actividad === fila.actividad) {
                    rowSpanCount++;
                } else {
                    break;
                }
            }
        }
        return { ...fila, isFirstOfGroup, rowSpanCount };
    });

    const tableRef = useRef(null);

    // ── MOTOR PDF LOCAL TOTALMENTE AISLADO ──────────────────────────────────
    const descargarPDFLocal = () => {
        // Landscape A4 orientation
        const doc = new jsPDF('landscape', 'pt', 'a4');

        // Encabezado Principal
        doc.setFillColor(26, 46, 74); // #1a2e4a
        doc.rect(40, 40, doc.internal.pageSize.width - 80, 80, 'F');

        doc.setTextColor(232, 160, 32); // #e8a020
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("DS 44 · GESTIÓN PREVENTIVA DE RIESGOS LABORALES", 55, 60);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.text(`Matriz IPER — ${iperData.proyecto}`, 55, 85);

        doc.setTextColor(176, 196, 222);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Generada: ${iperData.fecha}  |  Mandante: ${iperData.mandante || 'N/A'}  |  Ubicación: ${iperData.ubicacion || 'N/A'}`, 55, 105);

        // Preparar Data para AutoTable
        const tableHeaders = [
            ["Actividad\n(Proceso)", "Peligro", "Riesgo / Incidente", "Puro\nP×C=MR", "Controles DS 44", "Residual\nP×C=MR", "Requisitos Legales"]
        ];

        const tableBody = filasAgrupadas.map((f, i) => {
            // Controles formateados textualmente
            const controlesText = f.controles.map(c => `[${c.tipo.slice(0, 3).toUpperCase()}] ${c.medida}`).join("\n\n");
            const legalText = f.legal.join("\n");
            // Celdas precalculadas para PxC=MR
            const puroText = `P: ${f.riesgo_puro.p} x C: ${f.riesgo_puro.c}\n\nMR: ${f.riesgo_puro.mr}\n${f.riesgo_puro.nivel}`;
            const residualText = `P: ${f.riesgo_residual.p} x C: ${f.riesgo_residual.c}\n\nMR: ${f.riesgo_residual.mr}\n${f.riesgo_residual.nivel}`;

            const row = [
                f.peligro,
                f.riesgo,
                puroText,
                controlesText,
                residualText,
                legalText
            ];

            if (f.isFirstOfGroup) {
                row.unshift({ content: f.actividad, rowSpan: f.rowSpanCount, styles: { valign: 'middle' } });
            }

            return row;
        });

        // Mapeo de colores estáticos para AutoTable
        const nivelBgColor = {
            Substancial: [253, 232, 232],
            Moderado: [254, 243, 226],
            Aceptable: [232, 248, 240]
        };

        autoTable(doc, {
            startY: 130,
            head: tableHeaders,
            body: tableBody,
            theme: 'grid',
            headStyles: {
                fillColor: [44, 74, 114], // #2c4a72
                textColor: 255,
                fontSize: 9,
                fontStyle: 'bold',
                halign: 'center',
                valign: 'middle'
            },
            styles: {
                fontSize: 8.5,
                cellPadding: 4,
                textColor: [28, 42, 56]
            },
            columnStyles: {
                0: { cellWidth: 80, fontStyle: 'bold' },
                1: { cellWidth: 90 },
                2: { cellWidth: 110 },
                3: { cellWidth: 50, halign: 'center', valign: 'middle' },
                4: { cellWidth: 180 },
                5: { cellWidth: 50, halign: 'center', valign: 'middle' },
                6: { cellWidth: 80 }
            },
            didParseCell: function (data) {
                // Pintar celdas de riesgo según su nivel de texto
                if (data.section === 'body' && (data.column.index === 3 || data.column.index === 5)) {
                    const text = data.cell.raw;
                    if (text.includes('Substancial')) data.cell.styles.fillColor = nivelBgColor.Substancial;
                    else if (text.includes('Moderado')) data.cell.styles.fillColor = nivelBgColor.Moderado;
                    else if (text.includes('Aceptable')) data.cell.styles.fillColor = nivelBgColor.Aceptable;
                }
            }
        });

        // Pie de Página
        const finalY = doc.lastAutoTable.finalY || 130;
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("Metodología: P × C = MR | Aceptable ≤ 14 | Moderado 15–24 | Substancial ≥ 25", 40, finalY + 20);
        doc.text("Generado por Wirin Ambiental QHSE App", doc.internal.pageSize.width - 200, finalY + 20);

        // Descargar Documento
        doc.save(`Matriz_IPER_${iperData.proyecto.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
    };

    // ── Render Form + Vista Previa Estática ──────────────────────────────────
    return (
        <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: 13, color: "#1c2a38", display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

                {/* ============ LEFT PANEL: Formulario ============ */}
                <div style={{
                    width: "350px",
                    minWidth: "300px",
                    background: "#f9fafb",
                    padding: "20px",
                    borderRight: "1px solid #e5e7eb",
                    overflowY: "auto",
                    boxShadow: "inset -4px 0 12px rgba(0,0,0,0.02)"
                }}>
                    <div style={{ marginBottom: "20px" }}>
                        <div style={{ fontSize: 10, color: "#e8a020", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
                            DS 44 · Wirin Ambiental
                        </div>
                        <h2 style={{ margin: "4px 0 2px", fontSize: 18, fontWeight: 800, color: "#1a2e4a" }}>
                            ⚠️ Matriz IPER
                        </h2>
                        <p style={{ color: "#6b7280", fontSize: 11, margin: 0 }}>
                            Definición de Variables Proyecto
                        </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div>
                            <label style={labelStyle}>Proyecto / Contrato</label>
                            <input
                                style={inputStyle}
                                placeholder="Ej: Estudio de Flora y Fauna"
                                value={proyecto}
                                onChange={e => setProyecto(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Mandante / Cliente</label>
                            <input
                                style={inputStyle}
                                placeholder="Ej: Empresa Minera X"
                                value={mandante}
                                onChange={e => setMandante(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Ubicación / Sector</label>
                            <input
                                style={inputStyle}
                                placeholder="Ej: Faena Cordillera, Campamento"
                                value={ubicacion}
                                onChange={e => setUbicacion(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Fecha de Generación</label>
                            <input
                                type="date"
                                style={inputStyle}
                                value={fecha}
                                onChange={e => setFecha(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: "30px", padding: "16px", background: "#f0f4f8", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
                        <p style={{ fontSize: "11px", color: "#64748b", margin: 0, lineHeight: 1.5, marginBottom: "12px" }}>
                            <strong>Módulo Plantilla:</strong> Esta matriz IPER contiene data estática pre-aprobada por experto prevención DS44. Haga clic en el botón debajo para generar un PDF local.
                        </p>

                        {/* BOTÓN DE DESCARGA PDF NATIVA LOCAL */}
                        <button
                            onClick={descargarPDFLocal}
                            style={{
                                width: "100%", background: "#e8a020", color: "#fff", border: "none",
                                borderRadius: 6, padding: "12px 16px", fontSize: 13,
                                fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(232,160,32,0.3)",
                                transition: "transform 0.1s, background 0.2s"
                            }}
                            onMouseOver={e => e.currentTarget.style.background = "#d38e14"}
                            onMouseOut={e => e.currentTarget.style.background = "#e8a020"}
                            onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
                            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                        >
                            <span style={{ fontSize: "16px", marginRight: "6px", verticalAlign: "middle" }}>⬇</span>
                            EXPORTAR PDF (IPER)
                        </button>
                        <p style={{ fontSize: 9, textAlign: "center", color: "#94a3b8", marginTop: 8 }}>
                            Exportación aislada (jsPDF nativo)
                        </p>
                    </div>
                </div>

                {/* ============ RIGHT PANEL: Vista Previa IPER Estática ============ */}
                <div style={{ flex: 1, padding: "24px", overflowY: "auto", background: "#e8eee8" }}>

                    {/* Header Dashboard IPER */}
                    <div style={{
                        background: "linear-gradient(135deg, #1a2e4a 0%, #2c4a72 100%)",
                        borderRadius: "10px 10px 0 0", padding: "18px 22px",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        boxShadow: "0 4px 16px rgba(26,46,74,0.3)",
                    }}>
                        <div>
                            <h2 style={{ color: "#fff", margin: "0 0 2px", fontSize: 18, fontWeight: 800 }}>
                                📑 Matriz Prevención DS 44: {iperData.proyecto}
                            </h2>
                            <p style={{ color: "#b0c4de", fontSize: 11, margin: 0 }}>
                                {iperData.mandante && `Mandante: ${iperData.mandante} · `}
                                {iperData.ubicacion && `Ubicación: ${iperData.ubicacion} · `}
                                Fecha: {iperData.fecha}
                            </p>
                        </div>

                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <div style={{ display: "flex", gap: "6px" }}>
                                {["Substancial", "#c0392b", "Moderado", "#e67e22", "Aceptable", "#27ae60"].reduce((result, value, index, array) => {
                                    if (index % 2 === 0)
                                        result.push(
                                            <span key={value} style={{ background: array[index + 1], color: "#fff", borderRadius: 4, padding: "3px 9px", fontSize: 9, fontWeight: 700 }}>
                                                ● {value}
                                            </span>
                                        );
                                    return result;
                                }, [])}
                            </div>
                        </div>
                    </div>

                    {/* Tabla IPER Visual */}
                    <div ref={tableRef} style={{ background: "white", overflowX: "auto", borderRadius: "0 0 10px 10px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                        <table id="tabla-iper" style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5, minWidth: 900 }}>
                            <thead>
                                <tr>
                                    {["① Actividad", "② Peligro", "③ Riesgo / Incidente", "④ Riesgo Puro\nP×C=MR", "⑤ Controles DS 44", "⑥ Riesgo Residual\nP×C=MR", "⑦ Requisitos Legales"].map(h => (
                                        <th key={h} style={{
                                            background: "#e2e8f0", color: "#1e293b", padding: "12px 8px",
                                            textAlign: "center", fontSize: 10, fontWeight: 800,
                                            textTransform: "uppercase", letterSpacing: 0.5,
                                            border: "1px solid #cbd5e1",
                                            whiteSpace: "pre-line", lineHeight: 1.4,
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filasAgrupadas.map((fila, i) => {
                                    const nivelPuro = NIVEL_COLORS[fila.riesgo_puro?.nivel] || NIVEL_COLORS.Aceptable;
                                    return (
                                        <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                                            {/* Actividad */}
                                            {fila.isFirstOfGroup && (
                                                <td rowSpan={fila.rowSpanCount} style={{
                                                    padding: "10px 8px", border: "1px solid #e2e8f0",
                                                    fontWeight: 700, fontSize: 10, textTransform: "uppercase",
                                                    color: "#0f172a", borderLeft: "4px solid #e8a020",
                                                    verticalAlign: "middle", minWidth: 120, whiteSpace: "pre-line"
                                                }}>{fila.actividad}</td>
                                            )}

                                            {/* Peligro */}
                                            <td style={{ padding: "10px 8px", border: "1px solid #e2e8f0", verticalAlign: "top", minWidth: 140 }}>
                                                {fila.peligro}
                                            </td>

                                            {/* Riesgo */}
                                            <td style={{ padding: "10px 8px", border: "1px solid #e2e8f0", verticalAlign: "top", minWidth: 140 }}>
                                                {fila.riesgo}
                                            </td>

                                            {/* Riesgo Puro */}
                                            <td style={{
                                                padding: "10px 8px", border: "1px solid #e2e8f0",
                                                verticalAlign: "middle", background: nivelPuro.bg,
                                                minWidth: 110,
                                            }}>
                                                <NivelBadge {...fila.riesgo_puro} nivel={fila.riesgo_puro?.nivel} />
                                            </td>

                                            {/* Controles */}
                                            <td style={{ padding: "10px 8px", border: "1px solid #e2e8f0", verticalAlign: "top", minWidth: 220 }}>
                                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                                    {fila.controles?.map((ctrl, j) => (
                                                        <div key={j} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                                                            <CtrlTag tipo={ctrl.tipo} />
                                                            <span style={{ fontSize: 10, lineHeight: 1.5, color: "#334155" }}>{ctrl.medida}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>

                                            {/* Riesgo Residual */}
                                            <td style={{
                                                padding: "10px 8px", border: "1px solid #e2e8f0",
                                                verticalAlign: "middle",
                                                background: (NIVEL_COLORS[fila.riesgo_residual?.nivel] || NIVEL_COLORS.Aceptable).bg,
                                                minWidth: 110,
                                            }}>
                                                <NivelBadge {...fila.riesgo_residual} nivel={fila.riesgo_residual?.nivel} />
                                            </td>

                                            {/* Legal */}
                                            <td style={{ padding: "10px 8px", border: "1px solid #e2e8f0", verticalAlign: "top", minWidth: 140 }}>
                                                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                                                    {fila.legal?.map((l, j) => (
                                                        <li key={j} style={{
                                                            padding: "3px 0", fontSize: 9.5, color: "#475569",
                                                            borderBottom: j < fila.legal.length - 1 ? "1px dashed #cbd5e1" : "none",
                                                        }}>{l}</li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Footer stats in Table */}
                        <div style={{ padding: "12px", background: "#eef2f6", borderTop: "1px solid #cbd5e1", display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", gap: "10px" }}>
                                {["Substancial", "Moderado", "Aceptable"].map(nivel => {
                                    const count = filasAgrupadas.filter(f => f.riesgo_puro?.nivel === nivel).length || 0;
                                    const col = NIVEL_COLORS[nivel];
                                    return count > 0 ? (
                                        <div key={nivel} style={{
                                            background: col.bg, border: `1px solid ${col.border}`,
                                            borderRadius: 6, padding: "5px 12px",
                                            fontSize: 10, color: col.text, fontWeight: 700,
                                        }}>
                                            {nivel}: {count} riesgo{count !== 1 ? "s" : ""} puro{count !== 1 ? "s" : ""}
                                        </div>
                                    ) : null;
                                })}
                            </div>
                            <div style={{
                                background: "#e8f8f0", border: "1px solid #2ecc71",
                                borderRadius: 6, padding: "5px 12px",
                                fontSize: 10, color: "#27ae60", fontWeight: 700,
                            }}>
                                ✓ {filasAgrupadas.filter(f => f.riesgo_residual?.nivel === "Aceptable").length || 0} riesgos residuales Aceptables
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Estilos reutilizables ───────────────────────────────────────────────────
const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 700,
    color: "#475569", marginBottom: 6, textTransform: "uppercase",
    letterSpacing: 0.5,
};

const inputStyle = {
    width: "100%", padding: "10px 12px",
    border: "1px solid #cbd5e1", borderRadius: 6,
    fontSize: 13, color: "#0f172a", outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
    background: "#fff",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)"
};
