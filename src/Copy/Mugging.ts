const muggingVictory = [
    "Neighborhood kids cheer as you kick the mugger's ass.",
    "Who's badder than you? Nobody. Not the mugger whose ass you laid out.",
    "You're here to hustle meat and kick ass. And you're doing both.",
    "No pity. No remorse. This mugger fucked with the wrong hustler.",
];

export function randMuggingVictoryContent() {
    const len = muggingVictory.length;
    const i = Math.floor(Math.random() * len);
    return muggingVictory[i];
}
