"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Entity = {
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

type FetchEntitiesParams = {
    search?: string;
    sort?: "name" | "rating" | "country";
    order?: "asc" | "desc";
    page?: number;
    limit?: number;
};

export type ChartData = {
    genreDistribution: { name: string; value: number }[];
    ratingsDistribution: { rating: number; count: number }[];
    topRatedEntities: { name: string; rating: number }[];
};

type EntityContextType = {
    entities: Entity[];
    addEntity: (entity: Omit<Entity, "id">) => Promise<void>;
    deleteEntity: (id: number) => Promise<void>;
    updateEntity: (id: number, updatedEntity: Partial<Entity>) => Promise<void>;
    topRated: Entity | null;
    averageRated: Entity | null;
    lowestRated: Entity | null;
    chartData: ChartData;
    refreshEntities: (params?: FetchEntitiesParams) => Promise<void>;
};

const EntityContext = createContext<EntityContextType | undefined>(undefined);

export function EntityProvider({ children }: { children: ReactNode }) {
    const [entities, setEntities] = useState<Entity[]>([]);
    const [topRated, setTopRated] = useState<Entity | null>(null);
    const [averageRated, setAverageRated] = useState<Entity | null>(null);
    const [lowestRated, setLowestRated] = useState<Entity | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [chartData, setChartData] = useState<ChartData>({
        genreDistribution: [],
        ratingsDistribution: [],
        topRatedEntities: [],
    });

    const API_URL = "http://localhost:3000/entities";

    const refreshEntities = async (params: FetchEntitiesParams = {}) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.search) queryParams.append("search", params.search);
            if (params.sort) queryParams.append("sort", params.sort);
            if (params.order) queryParams.append("order", params.order);
            if (params.page) queryParams.append("page", params.page.toString());
            if (params.limit) queryParams.append("limit", params.limit.toString());
    
            const res = await fetch(`${API_URL}?${queryParams.toString()}`);
            const data = await res.json();
            setEntities(data.data);
        } catch (error) {
            console.error("Failed to fetch entities", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshEntities();
    }, []);

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
            Math.abs(curr.rating - avgRating) < Math.abs(prev.rating - avgRating)
                ? curr
                : prev
        );

        setTopRated(top);
        setLowestRated(bottom);
        setAverageRated(closestToAvg);
    };

    const calculateChartData = () => {
        const genreCounts: { [key: string]: number } = {};
        const ratingCounts: { [key: number]: number } = {};

        entities.forEach((entity) => {
            genreCounts[entity.genre] = (genreCounts[entity.genre] || 0) + 1;
            const roundedRating = Math.round(entity.rating);
            ratingCounts[roundedRating] = (ratingCounts[roundedRating] || 0) + 1;
        });

        const genreDistribution = Object.entries(genreCounts).map(([name, value]) => ({ name, value }));
        const ratingsDistribution = Object.entries(ratingCounts).map(([rating, count]) => ({
            rating: parseInt(rating),
            count,
        }));

        const topRatedEntities = [...entities].sort((a, b) => b.rating - a.rating).slice(0, 5).map((entity) => ({ name: entity.name, rating: entity.rating }));

        setChartData({ genreDistribution, ratingsDistribution, topRatedEntities });
    };

    useEffect(() => {
        calculateRatings();
        calculateChartData();
    }, [entities]);

    const addEntity = async (entity: Omit<Entity, "id">) => {
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(entity),
            });
            if (res.ok) {
                await refreshEntities();
            } else {
                console.error(await res.text());
            }
        } catch (error) {
            console.error("Failed to add entity", error);
        }
    };

    const deleteEntity = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (res.ok) {
                await refreshEntities();
            } else {
                console.error(await res.text());
            }
        } catch (error) {
            console.error("Failed to delete entity", error);
        }
    };

    const updateEntity = async (id: number, updatedEntity: Partial<Entity>) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedEntity),
            });
            if (res.ok) {
                await refreshEntities();
            } else {
                console.error(await res.text());
            }
        } catch (error) {
            console.error("Failed to update entity", error);
        }
    };

    return (
        <EntityContext.Provider
            value={{
                entities,
                addEntity,
                deleteEntity,
                updateEntity,
                topRated,
                averageRated,
                lowestRated,
                chartData,
                refreshEntities,
            }}
        >
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
