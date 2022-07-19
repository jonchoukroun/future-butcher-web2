/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { ChangeEvent, KeyboardEvent } from "react";

import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

interface TextInputProps {
    placeholder: string;
    lengthOptions?: [number, number];
    type?: string;
    value?: string;
    changeCB?: (e: ChangeEvent<HTMLInputElement>) => void;
    keyDownCB?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const TextInput = ({
    placeholder,
    lengthOptions: [minLength, maxLength] = [0, 100],
    type = "text",
    value,
    changeCB,
    keyDownCB,
}: TextInputProps) => {
    const { layout } = useWindowSize();
    const handleBlur = () => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    };
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            required
            minLength={minLength}
            maxLength={maxLength}
            css={css({
                blockSize: layout === "full" ? "46px" : "32px",
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
    );
};
