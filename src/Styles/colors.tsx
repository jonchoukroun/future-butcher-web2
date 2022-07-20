/** Amber-based palette */
const AMBER = "#ffb000";
const LIGHT_AMBER = "rgba(255, 176, 0, 0.75)";
const PALE_AMBER = "rgba(255, 176, 0, 0.3)";
const RED = "rgba(255, 51, 51, 1)";
const BLACK = "#171717";

export const Text = {
    base: AMBER,
    subtle: LIGHT_AMBER,
    disable: PALE_AMBER,
    inverse: BLACK,
    danger: RED,
};

export const Border = {
    base: AMBER,
    subtle: PALE_AMBER,
    accent: AMBER,
    danger: RED,
};

export const Background = {
    base: BLACK,
    inverse: LIGHT_AMBER,
    danger: RED,
};
