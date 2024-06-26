import { keyframes } from "@emotion/react";

import * as Colors from "./colors";

export const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(359deg); }
`;

export const blink = keyframes`
    50% { opacity: 0; }
`;

export const backgroundBlink = keyframes`
    50% { background-color: ${Colors.Background.base}}
`;

export const fadeOut = keyframes`
    from {opacity: 1; }
    to { opacity: 0; }
`;

export const buyColorFlash = keyframes`
    50% { color: ${Colors.Text.danger}; }
`;

export const sellColorFlash = keyframes`
    50% { color: ${Colors.Text.accent}; }
`;

export const bounceUp = keyframes`
    50% { transform: translateY(-8px); }
    80% { transform: translateY(4px); }
`;

export const bounceDown = keyframes`
    50% { transform: translateY(8px); }
    80% { transform: translateY(-8px); }
`;
