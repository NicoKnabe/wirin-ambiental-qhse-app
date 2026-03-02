"use client";

export default function WirinLogo({ size = 48 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Outer left leaf */}
            <path
                d="M30 80 C10 60 15 25 50 20 C40 45 35 65 30 80Z"
                fill="#4CAF50"
            />
            {/* Outer right leaf */}
            <path
                d="M90 80 C110 60 105 25 70 20 C80 45 85 65 90 80Z"
                fill="#4CAF50"
            />
            {/* Center yellow leaf */}
            <path
                d="M60 85 C40 65 45 30 60 18 C75 30 80 65 60 85Z"
                fill="#F9A825"
            />
            {/* Stem */}
            <path
                d="M60 85 L60 100"
                stroke="#2E7D32"
                strokeWidth="4"
                strokeLinecap="round"
            />
            {/* Small branch left */}
            <path
                d="M60 92 L50 98"
                stroke="#2E7D32"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            {/* Small branch right */}
            <path
                d="M60 92 L70 98"
                stroke="#2E7D32"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </svg>
    );
}
