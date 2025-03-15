"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Entity = {
    id: number;
    name: string;
    genre: string;
    status: boolean;
    theme: string;
    country: string;
    label: string;
    link: string;
};

type EntityContextType = {
    entities: Entity[];
    addEntity: (entity: Entity) => void;
};

const EntityContext = createContext<EntityContextType | undefined>(undefined);

export function EntityProvider({ children }: { children: ReactNode }) {
    const [entities, setEntities] = useState<Entity[]>([
        {
            id: 1,
            name: "Fleshgod Apocalypse",
            genre: "Technical Death Metal",
            status: true,
            theme: "Philosophy",
            country: "Italy",
            label: "Nuclear Blast",
            link: "https://www.metal-archives.com/bands/Fleshgod_Apocalypse/113185",
        },
    ]);

    const addEntity = (entity: Entity) => {
        setEntities((prevEntities) => [...prevEntities, entity]);
    };

    return (
        <EntityContext.Provider value={{ entities, addEntity }}>
            {children}
        </EntityContext.Provider>
    );
}

export function useEntity() {
    const context = useContext(EntityContext);
    if (!context) {
        throw new Error("useEntity must be used within an EntityProvider");
    }
    return context;
}
