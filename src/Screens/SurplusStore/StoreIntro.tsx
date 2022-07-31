/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrompt, ButtonPromptSize } from "../../Components/ButtonPrompt";
import { LineSize, PrintLine } from "../../Components/PrintLine";

interface StoreIntroProps {
    onSeeWeaponsClick: () => void;
    onSeePacksClick: () => void;
}

export function StoreIntro({
    onSeeWeaponsClick,
    onSeePacksClick,
}: StoreIntroProps) {
    return (
        <div css={{ marginBlockStart: "30px" }}>
            <PrintLine
                text={
                    "Welcome to the last bastion of freedom in LA! We stock the best gear to secure your liberty."
                }
                prompt={"passed"}
                size={LineSize.Body}
            />

            <PrintLine
                text={
                    "Ain't no more 2nd ammendment, but we still have all your personal defense needs."
                }
                prompt={"passed"}
                size={LineSize.Body}
            />

            <div css={{ marginBlockEnd: "20px" }}>
                <ButtonPrompt
                    label={"Browse weapons"}
                    size={ButtonPromptSize.Full}
                    clickCB={onSeeWeaponsClick}
                />
            </div>

            <PrintLine
                text={"You also look like you could use more carrying space."}
                prompt={"passed"}
                size={LineSize.Body}
            />

            <ButtonPrompt
                label={"Browse packs"}
                size={ButtonPromptSize.Full}
                clickCB={onSeePacksClick}
            />
        </div>
    );
}
