/** @jsx jsx */
import { css, jsx, SerializedStyles } from "@emotion/react";
import { ChangeEvent, KeyboardEvent } from "react";

import { Prompt } from "./Prompt";
import * as Colors from "../Styles/colors";

interface TextInputProps {
    type?: string;
    value?: string;
    placeholder: string;
    lengthOptions?: [number, number];
    blink?: boolean;
    styleOptions?: SerializedStyles;
    changeCB?: (e: ChangeEvent<HTMLInputElement>) => void;
    keyDownCB?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const TextInput = ({
    type = "text",
    value,
    placeholder,
    lengthOptions: [minLength, maxLength] = [0, 100],
    blink,
    styleOptions,
    changeCB,
    keyDownCB,
}: TextInputProps) => {
    const handleBlur = () => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    };
    return (
        <div
            css={css(
                {
                    display: "flex",
                    alignItems: "center",
                },
                styleOptions,
            )}
        >
            <Prompt blink={blink} />
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                required
                minLength={minLength}
                maxLength={maxLength}
                css={css({
                    blockSize: "38px",
                    inlineSize: "calc(100%)",
                    paddingInline: "8px",
                    backgroundColor: Colors.Background.base,
                    borderColor: Colors.Border.subtle,
                    borderRadius: "2px",
                    borderStyle: "solid",
                    borderWidth: "1px",
                    color: Colors.Text.base,
                    "&::placeholder": {
                        color: Colors.Text.disable,
                    },
                    fontSize: "16px",
                })}
                onChange={changeCB}
                onKeyUp={(e) => keyDownCB && keyDownCB(e)}
                onBlur={handleBlur}
            />
        </div>
    );
};
