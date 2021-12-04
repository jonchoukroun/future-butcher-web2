const PRIMARY = "rgba(170, 148, 57)";
const SECONDARY = "rgba(170, 148, 57, 0.5)";
const TERTIARY = "rgba(170, 148, 57, 0.25)";
// const WHITE = "#d1d1d5";
const WHITE = "rgba(255, 233, 142)";
// const BLUE = "#5CA0A3";
// const DARK_BLUE = "#236669";
const GREEN = "#467414";
const DARK_GREEN = "#284D00";
const BLACK = "#040c05";
const DANGER = "#802E16";
const GREY = "#282828";

// const PRIMARY = "#4CAD54";
// const SECONDARY = "rgba(76, 173, 84, 0.5)";
// const TERTIARY = "rgba(76, 173, 84, 0.25)";
// const WHITE = "rgb(158, 255, 166)";
// const BLUE = "#5CA0A3";
// const DARK_BLUE = "#236669";
// const BLACK = "#040c05";
// const DANGER = "#ae3c39";
// const GREY = "#282828";

export const Text = {
    primary: PRIMARY,
    secondary: SECONDARY,
    heading: WHITE,
    danger: DANGER,
    // accent: BLUE,
    accent: GREEN,
};

export const Border = {
    bright: PRIMARY,
    standard: SECONDARY,
    subtle: TERTIARY,
    // accent: DARK_BLUE,
    accent: DARK_GREEN,
};

export const Background = {
    screen: BLACK,
    // accent: BLUE,
    accent: GREEN,
    terminal: GREY,
    subtle: TERTIARY,
};
