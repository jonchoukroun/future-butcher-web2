export const enum StationKey {
    beverlyHills = "beverly_hills",
    downtown = "downtown",
    veniceBeach = "venice_beach",
    hollywood = "hollywood",
    compton = "compton",
    bellGardens = "bell_gardens",
}

export type Station = {
    key: StationKey;
    name: string;
    hours: number;
    stationDescription: string;
    gangName: string;
    gangDescription: string;
    gangTax: number;
    uniqueBuilding: string;
};

export const subwayStations: Array<Station> = [
    {
        key: StationKey.beverlyHills,
        name: "Beverly Hills",
        hours: 3,
        stationDescription:
            "High security, expensive cuts, and manicured lawns.",
        gangName: "Rollin' Spa Girls",
        gangDescription:
            "Militarized private security who hunt undesirables for sport.",
        gangTax: 100000,
        uniqueBuilding: "TBD",
    },
    {
        key: StationKey.downtown,
        name: "Downtown",
        hours: 2,
        stationDescription:
            "High rises and high finance, with a taste for fine cuts.",
        gangName: "Balls Fargaux",
        gangDescription: "Mega bank turned organized crime franchise.",
        gangTax: 10000,
        uniqueBuilding: "Bank",
    },
    {
        key: StationKey.veniceBeach,
        name: "Venice Beach",
        hours: 2,
        stationDescription:
            "Heal your body and soul with restorative yoga and free substandard medicine.",
        gangName: "The 3rd Eye Boys",
        gangDescription:
            "Roided-out yogis who'll put you in a downward dog... for good.",
        gangTax: 2000,
        uniqueBuilding: "Free Clinic",
    },
    {
        key: StationKey.hollywood,
        name: "Hollywood",
        hours: 1,
        stationDescription: "Cops can be your friend, for a price.",
        gangName: "Vine Street Raiders",
        gangDescription:
            "Rampant street kids who'll rob you and leave you their headshot.",
        gangTax: 0,
        uniqueBuilding: "Police Station",
    },
    {
        key: StationKey.compton,
        name: "Compton",
        hours: 1,
        stationDescription: "Cheap cuts and cheap tools for any DIY needs.",
        gangName: "None",
        gangDescription: "Disorganized maurauders, raiders, and cutthroats.",
        gangTax: 0,
        uniqueBuilding: "Hardware Store",
    },
    {
        key: StationKey.bellGardens,
        name: "Bell Gardens",
        hours: 2,
        stationDescription: "The American dream at its seediest.",
        gangName: "The Chamber of Commerce",
        gangDescription:
            "Heavily armed small business owners who encourage shopping.",
        gangTax: 5000,
        uniqueBuilding: "Gus's Army Surplus",
    },
];
