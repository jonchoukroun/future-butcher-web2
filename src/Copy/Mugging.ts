const muggingVictory = [
    "Neighborhood kids cheer as you kick the mugger's ass.",
    "Who's badder than you? Nobody. Not the mugger whose ass you laid out.",
    "You're here to hustle meat and kick ass. And you're doing both.",
    "No pity. No remorse. This mugger fucked with the wrong hustler.",
];

export function getVictoryCopy() {
    const len = muggingVictory.length;
    const i = Math.floor(Math.random() * len);
    return muggingVictory[i];
}

export function getDefeatCopy(hoursLost: number) {
    const copy = [
        `You lay unconscious in the gutter for ${hoursLost} ${pluralize(
            hoursLost,
        )} while local kids threw rocks at your sorry ass.`,
        `They didn't care for your attempt to fight. He gave you the ass kicking of a lifetime and left you bleeding in the street for ${hoursLost} ${pluralize(
            hoursLost,
        )}.`,
        ` You were out cold for ${hoursLost} ${pluralize(hoursLost)}.`,
    ];
    const i = Math.floor(Math.random() * copy.length);
    return copy[i];
}

function pluralize(time: number): string {
    return time === 1 ? "hour" : "hours";
}
