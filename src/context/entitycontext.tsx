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
        {
            id: 2,
            name: "Meshuggah",
            genre: "Progressive Metal",
            status: true,
            theme: "Mathematics, Human Nature",
            country: "Sweden",
            label: "Nuclear Blast",
            link: "https://www.metal-archives.com/bands/Meshuggah/240",
        },
        {
            id: 3,
            name: "Opeth",
            genre: "Progressive Death Metal",
            status: true,
            theme: "Nature, Death, Mysticism",
            country: "Sweden",
            label: "Moderbolaget",
            link: "https://www.metal-archives.com/bands/Opeth/755",
        },
        {
            id: 4,
            name: "Behemoth",
            genre: "Blackened Death Metal",
            status: true,
            theme: "Satanism, Anti-Christianity",
            country: "Poland",
            label: "Nuclear Blast",
            link: "https://www.metal-archives.com/bands/Behemoth/605",
        },
        {
            id: 5,
            name: "Carcass",
            genre: "Melodic Death Metal",
            status: true,
            theme: "Gore, Medical Themes",
            country: "United Kingdom",
            label: "Nuclear Blast",
            link: "https://www.metal-archives.com/bands/Carcass/188",
        },
        {
            id: 6,
            name: "Gojira",
            genre: "Progressive Metal, Death Metal",
            status: true,
            theme: "Environmentalism, Nature",
            country: "France",
            label: "Roadrunner Records",
            link: "https://www.metal-archives.com/bands/Gojira/7815",
        },
        {
            id: 7,
            name: "Amon Amarth",
            genre: "Melodic Death Metal",
            status: true,
            theme: "Viking Mythology, Norse Mythology",
            country: "Sweden",
            label: "Metal Blade",
            link: "https://www.metal-archives.com/bands/Amon_Amarth/739",
        },
        {
            id: 8,
            name: "Dark Tranquillity",
            genre: "Melodic Death Metal",
            status: true,
            theme: "Melancholy, War",
            country: "Sweden",
            label: "Century Media Records",
            link: "https://www.metal-archives.com/bands/Dark_Tranquillity/149",
        },
        {
            id: 9,
            name: "Death",
            genre: "Death Metal",
            status: false,
            theme: "Philosophy, Death, Mental Struggles",
            country: "United States",
            label: "Relapse Records",
            link: "https://www.metal-archives.com/bands/Death/70",
        },
        {
            id: 10,
            name: "Sylosis",
            genre: "Thrash Metal, Progressive Metal",
            status: true,
            theme: "Personal Struggles, Inner Turmoil",
            country: "United Kingdom",
            label: "Nuclear Blast",
            link: "https://www.metal-archives.com/bands/Sylosis/35492",
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
