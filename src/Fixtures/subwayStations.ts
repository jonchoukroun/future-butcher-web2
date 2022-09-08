import { StationType } from "../GameData";

export type StationDetailsType = {
    displayName: string;
    hours: number;
    stationDescription: string;
    gangdisplayName: string;
    gangDescription: string;
    gangTax: number;
    uniqueBuilding: string;
};

export const StationDetails: { [Station in StationType]: StationDetailsType } =
    {
        beverly_hills: {
            displayName: "Beverly Hills",
            hours: 2,
            stationDescription:
                "High security, expensive meat, and manicured lawns.",
            gangdisplayName: "Rollin' Spa Girls",
            gangDescription:
                "Militarized private security who hunt undesirables for sport.",
            gangTax: 100000,
            uniqueBuilding: "TBD",
        },
        downtown: {
            displayName: "Downtown",
            hours: 1,
            stationDescription:
                "High rises and high finance, with a taste for fine meat.",
            gangdisplayName: "Balls Fargaux",
            gangDescription: "Mega bank turned organized crime franchise.",
            gangTax: 10000,
            uniqueBuilding: "Bank",
        },
        venice_beach: {
            displayName: "Venice Beach",
            hours: 1,
            stationDescription:
                "Heal your body and soul with restorative yoga and substandard medicine.",
            gangdisplayName: "The 3rd Eye Boys",
            gangDescription:
                "Roided-out yogis who'll put you in downward dog... for good.",
            gangTax: 2000,
            uniqueBuilding: "Free Clinic",
        },
        hollywood: {
            displayName: "Hollywood",
            hours: 1,
            stationDescription: "Dingy and dangerous, home of the stars.",
            gangdisplayName: "Vine Street Raiders",
            gangDescription:
                "Rampant street kids who'll rob you and leave you their headshot.",
            gangTax: 0,
            uniqueBuilding: "Police Station",
        },
        compton: {
            displayName: "Compton",
            hours: 1,
            stationDescription: "Cheap cuts, if you can handle the heat.",
            gangdisplayName: "None",
            gangDescription:
                "Disorganized maurauders, raiders, and cutthroats.",
            gangTax: 0,
            uniqueBuilding: "Hardware Store",
        },
        bell_gardens: {
            displayName: "Bell Gardens",
            hours: 2,
            stationDescription: "The American dream at its seediest.",
            gangdisplayName: "The Chamber of Commerce",
            gangDescription:
                "Heavily armed small business owners who encourage shopping.",
            gangTax: 5000,
            uniqueBuilding: "Gus's Army Surplus",
        },
    };
