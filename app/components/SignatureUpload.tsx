"use client";

import { useRef, useState } from "react";

interface SignatureUploadProps {
    /** Label shown above the signature area */
    label?: string;
    /** Pre-filled name (from form data) */
    name: string;
    /** Role/cargo shown below the name */
    role: string;
    /** Called when a signature image is selected */
    onSignatureChange?: (dataUrl: string | null) => void;
    /** If a dataUrl is passed in, render it instead of the empty box */
    signatureDataUrl?: string | null;
    /** Small = compact mode for diffusion tables */
    small?: boolean;
}

/**
 * SignatureUpload
 *
 * Renders a signature block that:
 * 1. Shows a dashed line + name + role when no image is loaded
 * 2. Shows the uploaded PNG/JPEG image when one is selected
 * 3. Provides a hover overlay to change/clear the image
 * 4. Works for both form-side (interactive) and preview-side (display-only)
 */
export default function SignatureUpload({
    label,
    name,
    role,
    onSignatureChange,
    signatureDataUrl,
    small = false,
}: SignatureUploadProps) {
    const [localUrl, setLocalUrl] = useState<string | null>(signatureDataUrl ?? null);
    const [hovering, setHovering] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const hasImage = !!localUrl;
    const height = small ? 32 : 48;

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = ev.target?.result as string;
            setLocalUrl(result);
            onSignatureChange?.(result);
        };
        reader.readAsDataURL(file);
        // Reset so same file can be re-uploaded
        e.target.value = "";
    };

    const clear = (ev: React.MouseEvent) => {
        ev.stopPropagation();
        setLocalUrl(null);
        onSignatureChange?.(null);
    };

    return (
        <div style={{ textAlign: "center", flex: 1 }}>
            {/* Signature area */}
            <div
                onClick={() => fileRef.current?.click()}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                style={{
                    position: "relative",
                    height: `${height}px`,
                    border: hasImage ? "none" : "1px dashed #9e9e9e",
                    borderRadius: "4px",
                    marginBottom: "6px",
                    cursor: "pointer",
                    overflow: "hidden",
                    background: hovering && !hasImage ? "#f0fdf4" : "transparent",
                    transition: "background 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                title={hasImage ? "Haz clic para cambiar la firma" : "Haz clic para subir firma (PNG/JPEG)"}
            >
                {hasImage ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={localUrl!}
                            alt="Firma digital"
                            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                        />
                        {/* Hover overlay */}
                        {hovering && (
                            <div style={{
                                position: "absolute", inset: 0,
                                background: "rgba(255,255,255,0.75)",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            }}>
                                <span style={{ fontSize: "10px", color: "#1B5E20", fontWeight: 700 }}>✎ Cambiar</span>
                                <button
                                    onClick={clear}
                                    style={{ fontSize: "10px", color: "#c62828", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
                                >
                                    ✕ Quitar
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <span style={{ fontSize: small ? "8px" : "9px", color: hovering ? "#4CAF50" : "#bdbdbd", pointerEvents: "none" }}>
                        {hovering ? "⬆ Subir firma PNG/JPG" : "✎ Firma"}
                    </span>
                )}
            </div>

            {/* Hidden input */}
            <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                style={{ display: "none" }}
                onChange={handleFile}
            />

            {/* Name + Role */}
            {label && (
                <p style={{
                    fontSize: small ? "6.5pt" : "7pt",
                    fontWeight: 700,
                    color: "#1B5E20",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "2px",
                }}>{label}</p>
            )}
            <p style={{ fontWeight: 700, fontSize: small ? "7.5pt" : "8.5pt", margin: 0 }}>{name || "—"}</p>
            <p style={{ fontSize: small ? "6.5pt" : "7.5pt", color: "#6b7280", margin: 0 }}>{role}</p>
        </div>
    );
}
