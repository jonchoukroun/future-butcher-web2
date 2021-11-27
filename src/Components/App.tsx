/** @jsx jsx */
import { Global, css, jsx } from "@emotion/react";
import * as React from "react";

import { Window } from "./Window/Window";
import * as Colors from "../Styles/colors";

export const App = () => {
    return (
        <div>
            <Global
                styles={css({
                    body: {
                        margin: 0,
                        backgroundColor: Colors.Background.page,
                    },
                })}
            />
            <Window title="Future Butcher" />
        </div>
    );
};
