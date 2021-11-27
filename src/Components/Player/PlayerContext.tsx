import * as React from "react";

const { createContext, useContext, useState } = React;

const PlayerContext = createContext<
    | {
          name: string | undefined;
          saveName: (name: string) => void;
      }
    | undefined
>(undefined);

/**
 * This provider stores player state
 */
export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [playerName, setPlayerName] = useState<string | undefined>(undefined);

    const saveName = (name: string) => {
        // validate player name
        setPlayerName(name);
    };

    const value = {
        name: playerName,
        saveName,
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error("usePlayer must be used within a PlayerProvider");
    }
    return context;
}
