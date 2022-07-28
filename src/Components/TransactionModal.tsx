/** @jsx jsx */
import { jsx } from "@emotion/react";

interface TransactionModalProps {
    listing: StorePackType | StoreWeaponType;
    onModalClose: () => void;
}

export function TransactionModal({
    listing,
    onModalClose,
}: TransactionModalProps) {
    return (
        <div>
            <h1>{listing[0]}</h1>
            <button onClick={onModalClose}>close</button>
        </div>
    );
}
