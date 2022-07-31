import { OwnedCutsType } from "./../GameData/Player";

export function getSpaceAvailable({
    totalPackSpace,
    pack,
}: {
    totalPackSpace: number;
    pack: OwnedCutsType;
}) {
    return (
        totalPackSpace -
        Object.entries(pack).reduce((sum, [, amount]) => (sum += amount), 0)
    );
}
