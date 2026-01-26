export default function AppHeroImage() {
    return (
        <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-primary/5 blur-3xl" />
            <svg
                viewBox="0 0 600 400"
                xmlns="http://www.w3.org/2000/svg"
                className="h-auto w-full drop-shadow-2xl"
                aria-hidden="true"
            >
                {/* Background grid for kanban feel */}
                <defs>
                    <pattern
                        id="grid"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke="currentColor"
                            strokeOpacity="0.1"
                            strokeWidth="1"
                        />
                    </pattern>
                </defs>
                <rect width="600" height="400" fill="url(#grid)" />

                {/* Three columns */}
                <g transform="translate(80,60)">
                    <rect
                        x="0"
                        y="0"
                        width="140"
                        height="280"
                        rx="12"
                        fill="currentColor"
                        fillOpacity="0.05"
                        stroke="currentColor"
                        strokeOpacity="0.2"
                        strokeWidth="2"
                    />
                    <text
                        x="70"
                        y="30"
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight="600"
                        fill="currentColor"
                        opacity="0.8"
                    >
                        Новая
                    </text>

                    {/* Cards */}
                    <rect
                        x="10"
                        y="60"
                        width="120"
                        height="80"
                        rx="8"
                        fill="currentColor"
                        fillOpacity="0.08"
                    />
                    <rect
                        x="15"
                        y="70"
                        width="90"
                        height="6"
                        rx="3"
                        fill="currentColor"
                        fillOpacity="0.4"
                    />
                    <rect
                        x="15"
                        y="85"
                        width="70"
                        height="6"
                        rx="3"
                        fill="currentColor"
                        fillOpacity="0.3"
                    />

                    <rect
                        x="10"
                        y="160"
                        width="120"
                        height="80"
                        rx="8"
                        fill="currentColor"
                        fillOpacity="0.08"
                    />
                    <rect
                        x="15"
                        y="170"
                        width="100"
                        height="6"
                        rx="3"
                        fill="currentColor"
                        fillOpacity="0.4"
                    />
                    <rect
                        x="15"
                        y="185"
                        width="80"
                        height="6"
                        rx="3"
                        fill="currentColor"
                        fillOpacity="0.3"
                    />
                </g>

                <g transform="translate(240,60)">
                    <rect
                        x="0"
                        y="0"
                        width="140"
                        height="280"
                        rx="12"
                        fill="currentColor"
                        fillOpacity="0.05"
                        stroke="currentColor"
                        strokeOpacity="0.2"
                        strokeWidth="2"
                    />
                    <text
                        x="70"
                        y="30"
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight="600"
                        fill="currentColor"
                        opacity="0.8"
                    >
                        В процессе
                    </text>

                    {/* Dragged card */}
                    <g opacity="0.7">
                        <rect
                            x="10"
                            y="100"
                            width="120"
                            height="80"
                            rx="8"
                            fill="currentColor"
                            fillOpacity="0.12"
                            stroke="currentColor"
                            strokeDasharray="4 4"
                            strokeOpacity="0.5"
                        />
                        <rect
                            x="15"
                            y="110"
                            width="95"
                            height="6"
                            rx="3"
                            fill="currentColor"
                            fillOpacity="0.5"
                        />
                        <rect
                            x="15"
                            y="125"
                            width="75"
                            height="6"
                            rx="3"
                            fill="currentColor"
                            fillOpacity="0.4"
                        />
                    </g>
                </g>

                <g transform="translate(400,60)">
                    <rect
                        x="0"
                        y="0"
                        width="140"
                        height="280"
                        rx="12"
                        fill="currentColor"
                        fillOpacity="0.05"
                        stroke="currentColor"
                        strokeOpacity="0.2"
                        strokeWidth="2"
                    />
                    <text
                        x="70"
                        y="30"
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight="600"
                        fill="currentColor"
                        opacity="0.8"
                    >
                        Завершена
                    </text>

                    {/* Completed cards with green check */}
                    <rect
                        x="10"
                        y="60"
                        width="120"
                        height="80"
                        rx="8"
                        fill="currentColor"
                        fillOpacity="0.08"
                    />
                    <circle cx="25" cy="100" r="8" fill="#10b981" />
                    <rect
                        x="40"
                        y="95"
                        width="70"
                        height="6"
                        rx="3"
                        fill="currentColor"
                        fillOpacity="0.4"
                    />

                    <rect
                        x="10"
                        y="160"
                        width="120"
                        height="80"
                        rx="8"
                        fill="currentColor"
                        fillOpacity="0.08"
                    />
                    <circle cx="25" cy="200" r="8" fill="#10b981" />
                    <rect
                        x="40"
                        y="195"
                        width="80"
                        height="6"
                        rx="3"
                        fill="currentColor"
                        fillOpacity="0.4"
                    />
                </g>

                {/* Drag arrow */}
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="10"
                        refX="8"
                        refY="3"
                        orient="auto"
                        markerUnits="strokeWidth"
                    >
                        <path
                            d="M0,0 L0,6 L9,3 z"
                            fill="currentColor"
                            opacity="0.3"
                        />
                    </marker>
                </defs>
            </svg>
        </div>
    );
}
