/** @jsx jsx */
import { jsx } from "@emotion/react";

import { CSSProperties, FC, SVGProps } from "react";

export type IconType = Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
    bgStyle?: CSSProperties;
    borderRadius?: number;
    iconFillColor?: string;
    round?: boolean;
    size?: number | string;
};

interface IconProps {
    color: string;
    networkName: string;
    path: string;
}

export function createIcon(iconProps: IconProps) {
    const Icon: FC<IconType> = ({
        bgStyle,
        borderRadius,
        iconFillColor,
        round,
        size,
        ...rest
    }) => (
        <svg viewBox="0 0 64 64" width={size} {...rest}>
            {round ? (
                <circle
                    cx="32"
                    cy="32"
                    r="31"
                    fill={iconProps.color}
                    style={bgStyle}
                />
            ) : (
                <rect
                    width="64"
                    height="64"
                    rx={borderRadius}
                    ry={borderRadius}
                    fill={iconProps.color}
                    style={bgStyle}
                />
            )}

            <path d={iconProps.path} fill={iconFillColor} />
        </svg>
    );

    Icon.defaultProps = {
        bgStyle: {},
        borderRadius: 0,
        iconFillColor: "white",
        size: 64,
    };

    return Icon;
}
