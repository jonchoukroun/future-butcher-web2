import { keyframes } from "@emotion/react";

export const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(359deg); }
`;

export const blink = keyframes`
    50% { opacity: 0; }
`;
