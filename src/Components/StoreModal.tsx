/** @jsx jsx */
import { jsx } from "@emotion/react";
import { PackListing, WeaponListing } from "../GameData";

interface StoreModalProps {
    listing: PackListing | WeaponListing;
    onModalClose: () => void;
}

export function StoreModal({ listing, onModalClose }: StoreModalProps) {
    const name = Object.keys(listing)[0];
    return (
        <div>
            <h1>{name}</h1>
            <button onClick={onModalClose}>close</button>
        </div>
    );
}
