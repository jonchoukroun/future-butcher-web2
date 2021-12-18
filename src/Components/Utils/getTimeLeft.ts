export function getTimeLeft(turnsLeft: number): string {
    const currentTurn = 24 - turnsLeft;
    const time = (currentTurn % 12) + 5;
    const hours = time === 0 ? 12 : time;

    const unit = currentTurn >= 7 && currentTurn <= 18 ? "pm" : "am";

    return `${hours}:00 ${unit}`;
}
