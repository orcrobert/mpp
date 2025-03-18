"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Entity = {
    id: number;
    name: string;
    genre: string;
    rating: number;
    status: boolean;
    theme: string;
    country: string;
    label: string;
    link: string;
};

type EntityContextType = {
    entities: Entity[];
    addEntity: (entity: Entity) => void;
    deleteEntity: (id: number) => void;
    updateEntity: (id: number, updatedEntity: Entity) => void;
    topRated: Entity | null;
    averageRated: Entity | null;
    lowestRated: Entity | null;
};

const EntityContext = createContext<EntityContextType | undefined>(undefined);

export function EntityProvider({ children }: { children: ReactNode }) {
    const [topRated, setTopRated] = useState<Entity | null>(null);
    const [averageRated, setAverageRated] = useState<Entity | null>(null);
    const [lowestRated, setLowestRated] = useState<Entity | null>(null);

    const [entities, setEntities] = useState<Entity[]>([
        {
            id: 1,
            name: "Fleshgod Apocalypse",
            genre: "Technical Death Metal",
            rating: 9.8,
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
            rating: 7.8,
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
            rating: 9.5,
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
            rating: 8.7,
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
            rating: 9.0,
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
            rating: 7.2,
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
            rating: 8.9,
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
            rating: 9.9,
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
            rating: 9.5,
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
            rating: 7.6,
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

    const deleteEntity = (id: number) => {
        setEntities((prevEntities) => prevEntities.filter((entity) => entity.id !== id));
    };

    const updateEntity = (id: number, updatedEntity: Entity) => {
        setEntities((prevEntities) =>
            prevEntities.map((entity) => (entity.id === id ? updatedEntity : entity))
        );
    };

    const calculateRatings = () => {
        if (entities.length === 0) {
            setTopRated(null);
            setAverageRated(null);
            setLowestRated(null);
            return;
        }

        const sortedEntities = [...entities].sort((a, b) => b.rating - a.rating);
        const top = sortedEntities[0];
        const bottom = sortedEntities[sortedEntities.length - 1];

        const avgRating = entities.reduce((sum, entity) => sum + entity.rating, 0) / entities.length;
        const closestToAvg = sortedEntities.reduce((prev, curr) =>
            Math.abs(curr.rating - avgRating) < Math.abs(prev.rating - avgRating) ? curr : prev
        );

        setTopRated(top);
        setLowestRated(bottom);
        setAverageRated(closestToAvg);
    };

    useEffect(() => {
        calculateRatings();
    }, [entities]);

    return (
        <EntityContext.Provider value={{ entities, addEntity, deleteEntity, updateEntity, topRated, averageRated, lowestRated }}>
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
