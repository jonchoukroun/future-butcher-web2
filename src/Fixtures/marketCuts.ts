export type CutType = {
    name: string;
    price: number;
    quantity: number;
};

export const cuts: Array<CutType> = [
    {
        name: "heart",
        price: 18000,
        quantity: 12,
    },
    {
        name: "flank",
        price: 7312,
        quantity: 17,
    },
    {
        name: "brain",
        price: 78900,
        quantity: 3,
    },
    {
        name: "loin",
        price: 800,
        quantity: 34,
    },
    {
        name: "ribs",
        price: 1011,
        quantity: 24,
    },
];
