import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="4"
                y="8"
                width="8"
                height="20"
                rx="2"
                fill="currentColor"
                fillOpacity="1"
            />
            <rect
                x="16"
                y="4"
                width="8"
                height="32"
                rx="2"
                fill="currentColor"
                fillOpacity="0.8"
            />
            <rect
                x="28"
                y="14"
                width="8"
                height="18"
                rx="2"
                fill="currentColor"
                fillOpacity="0.6"
            />
        </svg>
    );
}