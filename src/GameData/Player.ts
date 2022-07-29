import { CutType, WeaponType } from ".";

export type PlayerType = {
    debt: number;
    funds: number;
    health: number;
    playerName: string;
    pack: OwnedCutsType;
    // TODO: add runtime validation
    totalPackSpace: number;
    weapon: WeaponType | null;
};

export type OwnedCutsType = {
    [Cut in CutType]: number;
};
