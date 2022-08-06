/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useEffect, useState } from "react";

import { AlertType, useAlertService } from "./AlertServiceProvider";
import { Button, ButtonScheme, ButtonSize, PrintLine } from "../Components";
import { LineSize } from "../Components/PrintLine";

import * as Animations from "../Styles/animations";
import * as Colors from "../Styles/colors";

const ALERT_DURATION = 2000;
const FADE_OUT_DURATION = 1000;

interface AlertProps {
    queueKey: number;
    alert: AlertType;
}

export function Alert({ queueKey, alert }: AlertProps) {
    const { popAlert } = useAlertService();

    const [shouldFadeOut, setShouldFadeOut] = useState(false);
    useEffect(() => {
        if (alert.isPersistent) return;

        const fadeInterval = setInterval(() => {
            setShouldFadeOut(true);
        }, ALERT_DURATION);

        const closeInterval = setInterval(() => {
            popAlert(queueKey);
        }, ALERT_DURATION + FADE_OUT_DURATION - 100);

        return () => {
            clearInterval(fadeInterval);
            clearInterval(closeInterval);
        };
    }, [alert.isPersistent, popAlert, queueKey]);

    const handleClick = () => {
        popAlert(queueKey);
    };

    return (
        <div
            css={{
                marginBlockEnd: "10px",
                padding: "8px",
                backgroundColor: Colors.Background.base,
                borderColor: Colors.Border.base,
                borderStyle: "outset",
                borderWidth: "3px",
                animation: shouldFadeOut
                    ? `${Animations.fadeOut} ${FADE_OUT_DURATION}ms ease`
                    : 0,
            }}
            onClick={() => {
                if (!alert.isPersistent) handleClick();
            }}
        >
            <PrintLine text={alert.text} size={LineSize.Body} />

            {alert.isPersistent && (
                <div
                    css={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBlockStart: "10px",
                    }}
                >
                    <Button
                        label={"Close"}
                        size={ButtonSize.Small}
                        scheme={ButtonScheme.Inverse}
                        clickCB={handleClick}
                    />
                </div>
            )}
        </div>
    );
}
