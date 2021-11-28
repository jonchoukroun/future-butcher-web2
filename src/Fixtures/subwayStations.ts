export type Station = {
    key: string;
    name: string;
    gangTax: number;
    uniqueBuilding: string;
    gangDescription: string;
};

export const subwayStations: Array<Station> = [
    {
        key: "beverly_hills",
        name: "Beverly Hills",
        gangTax: 100000,
        uniqueBuilding: "None",
        gangDescription:
            "Militarized private security who hunt undesirables for sport.",
    },
    {
        key: "downtown",
        name: "Downtown",
        gangTax: 10000,
        uniqueBuilding: "Bank",
        gangDescription: "Mega bank turned organized crime franchise.",
    },
    {
        key: "venice_beach",
        name: "Venice Beach",
        gangTax: 2000,
        uniqueBuilding: "Free Clinic",
        gangDescription:
            "Roided-out yogis who'll put you in a downward dog... for good.",
    },
    {
        key: "hollywood",
        name: "Hollywood",
        gangTax: 0,
        uniqueBuilding: "None",
        gangDescription:
            "Rampant street kids who'll rob you and leave you their headshot.",
    },
    {
        key: "compton",
        name: "Compton",
        gangTax: 0,
        uniqueBuilding: "Hardware Store",
        gangDescription: "Disorganized maurauders, raiders, and cutthroats.",
    },
    {
        key: "bell_gardens",
        name: "Bell Gardens",
        gangTax: 5000,
        uniqueBuilding: "Gus's Army Surplus Store",
        gangDescription:
            "Heavily armed small business owners who encourage shopping.",
    },
];
