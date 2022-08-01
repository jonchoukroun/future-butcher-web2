/** Amber-based palette */
const AMBER = "rgba(255, 176, 0, 1)";
const LIGHT_AMBER = "rgba(255, 176, 0, 0.75)";
const PALE_AMBER = "rgba(255, 176, 0, 0.3)";
const GREEN = "rgba(102, 255, 102)";
const RED = "rgba(255, 51, 51, 1)";
const BLACK = "#282828";

export const Text = {
    base: AMBER,
    subtle: LIGHT_AMBER,
    disable: PALE_AMBER,
    inverse: BLACK,
    danger: RED,
    accent: GREEN,
};

export const Border = {
    base: AMBER,
    subtle: PALE_AMBER,
    accent: GREEN,
    danger: RED,
};

export const Background = {
    base: BLACK,
    inverse: LIGHT_AMBER,
    subtle: PALE_AMBER,
    danger: RED,
};
