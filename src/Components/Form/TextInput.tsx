/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { ChangeEvent, KeyboardEvent } from "react";

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
    return (
        <input
            type="text"
            placeholder={placeholder}
            required
            minLength={minLength}
            maxLength={maxLength}
            css={css({
                blockSize: "32px",
                inlineSize: "calc(100%)",
                marginBlockStart: "10px",
                bordeWidth: "2px",
                borderStyle: "inset",
                borderBlockStartColor: Colors.Border.dark,
                borderInlineStartColor: Colors.Border.dark,
                borderBlockEndColor: Colors.Border.light,
                borderInlineEndColor: Colors.Border.light,
                borderRadius: "2px",
            })}
            onChange={changeCB}
            onKeyPress={(e) => keypressCB && keypressCB(e)}
        />
    );
};
