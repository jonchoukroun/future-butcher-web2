/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { ChangeEvent, KeyboardEvent } from "react";

import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

interface TextInputProps {
    placeholder: string;
    lengthOptions?: [number, number];
    changeCB?: (e: ChangeEvent<HTMLInputElement>) => void;
    keypressCB?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const TextInput = ({
    placeholder,
    lengthOptions: [minLength, maxLength] = [0, 100],
    changeCB,
    keypressCB,
}: TextInputProps) => {
    const { layout } = useWindowSize();
    const handleBlur = () => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    };
    return (
        <input
            type="text"
            placeholder={placeholder}
            required
            minLength={minLength}
            maxLength={maxLength}
            css={css({
                blockSize: layout === "full" ? "46px" : "32px",
                inlineSize: "calc(100%)",
                marginBlockStart: "10px",
                paddingInline: "8px",
                backgroundColor: Colors.Background.base,
                borderColor: Colors.Border.subtle,
                borderRadius: "2px",
                borderStyle: "solid",
                borderWidth: "1px",
                color: Colors.Text.base,
                "&::placeholder": {
                    color: Colors.Text.subtle,
                },
                fontSize: "16px",
            })}
            onChange={changeCB}
            onKeyPress={(e) => keypressCB && keypressCB(e)}
            onBlur={handleBlur}
        />
    );
};
