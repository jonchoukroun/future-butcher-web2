import { CutType, WeaponType } from ".";

export type PlayerType = {
    debt: number;
    cash: number;
    hasOil: boolean;
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
