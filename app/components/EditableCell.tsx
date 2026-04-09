"use client";

import { useState } from "react";

/**
 * EditableCell — texto editable inline para encabezados de tabla (<th>).
 * En pantalla muestra un input transparente que permite editar haciendo clic.
 * En impresión se ve como texto normal (sin bordes ni estilos de input).
 */
interface Props {
    children: string;
    align?: "left" | "center" | "right";
}

export default function EditableCell({ children, align = "center" }: Props) {
    const [value, setValue] = useState(children);

    return (
        <input
            value={value}
            onChange={e => setValue(e.target.value)}
            title="Haz clic para editar este encabezado"
            style={{
                background: "transparent",
                border: "none",
                outline: "none",
                fontWeight: "inherit",
                fontSize: "inherit",
                fontFamily: "inherit",
                color: "inherit",
                textAlign: align,
                letterSpacing: "inherit",
                width: "100%",
                cursor: "text",
                padding: "0",
                minWidth: "40px",
            }}
        />
    );
}
