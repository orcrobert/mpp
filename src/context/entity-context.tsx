"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";

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
    isNetworkDown: boolean;
    isServerDown: boolean;
};

const EntityContext = createContext<EntityContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "pendingEntitiesOperations";
const LOCAL_STORAGE_CACHE_KEY = "cachedEntities";

type PendingOperation =
    | { type: "add"; payload: Omit<Entity, "id"> }
    | { type: "delete"; payload: number }
    | { type: "update"; payload: { id: number; data: Partial<Entity> } };

export function EntityProvider({ children }: { children: ReactNode }) {
    const [entities, setEntities] = useState<Entity[]>(() => {
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
            return cached ? JSON.parse(cached) : [];
        }
        return [];
    });
    const [topRated, setTopRated] = useState<Entity | null>(null);
    const [averageRated, setAverageRated] = useState<Entity | null>(null);
    const [lowestRated, setLowestRated] = useState<Entity | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [chartData, setChartData] = useState<ChartData>({
        genreDistribution: [],
        ratingsDistribution: [],
        topRatedEntities: [],
    });
    const [isNetworkDown, setIsNetworkDown] = useState(!navigator.onLine);
    const [isServerDown, setIsServerDown] = useState(false);
    const [pendingOperations, setPendingOperations] = useState<PendingOperation[]>(
        () => {
            if (typeof window !== 'undefined') {
                const storedOperations = localStorage.getItem(LOCAL_STORAGE_KEY);
                return storedOperations ? JSON.parse(storedOperations) : [];
            }
            return [];
        }
    );

    const API_URL = "http://localhost:3000/entities";

    const checkServerStatus = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/health`);
            setIsServerDown(!response.ok);
        } catch (error) {
            setIsServerDown(true);
        }
    }, [API_URL]);

    useEffect(() => {
        const handleOnline = () => setIsNetworkDown(false);
        const handleOffline = () => setIsNetworkDown(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);


    const refreshEntities = async (params: FetchEntitiesParams = {}) => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (params.search) queryParams.append("search", params.search);
            if (params.sort) queryParams.append("sort", params.sort);
            if (params.order) queryParams.append("order", params.order);
            if (params.page) queryParams.append("page", params.page.toString());
            if (params.limit) queryParams.append("limit", params.limit.toString());

            const res = await fetch(`${API_URL}?${queryParams.toString()}`);
            if (!res.ok) {
                console.error("Failed to fetch entities from server");
                if (typeof window !== 'undefined') {
                    const cached = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
                    if (cached) {
                        setEntities(JSON.parse(cached));
                    }
                }
                setIsServerDown(true);
            } else {
                const data = await res.json();
                setEntities(data.data);
                // Cache the fetched data
                if (typeof window !== 'undefined') {
                    localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(data.data));
                }
                setIsServerDown(false);
            }
        } catch (error) {
            console.error("Failed to fetch entities", error);
            if (typeof window !== 'undefined') {
                const cached = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
                if (cached) {
                    setEntities(JSON.parse(cached));
                }
            }
            setIsServerDown(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkServerStatus();
        const intervalId = setInterval(checkServerStatus, 5000);
        return () => clearInterval(intervalId);
    }, [checkServerStatus]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pendingOperations));
        }
    }, [pendingOperations]);

    const syncPendingOperations = useCallback(async () => {
        if (!isNetworkDown && !isServerDown && pendingOperations.length > 0) {
            for (const operation of pendingOperations) {
                try {
                    let response;
                    if (operation.type === "add") {
                        response = await fetch(API_URL, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(operation.payload),
                        });
                    } else if (operation.type === "delete") {
                        response = await fetch(`${API_URL}/${operation.payload}`, { method: "DELETE" });
                    } else if (operation.type === "update") {
                        response = await fetch(`${API_URL}/${operation.payload.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(operation.payload.data),
                        });
                    }

                    if (response?.ok) {
                        setPendingOperations((prev) => prev.filter((op) => op !== operation));
                        if (operation.type === "delete") {
                            setEntities((prevEntities) =>
                                prevEntities.filter((entity) => entity.id !== operation.payload)
                            );
                            if (typeof window !== 'undefined') {
                                localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(entities));
                            }
                        } else if (operation.type === "add" || operation.type === "update") {
                            await refreshEntities();
                            return;
                        }
                    } else {
                        console.error("Failed to sync operation:", operation, await response?.text());
                    }
                } catch (error) {
                    console.error("Error syncing operation:", operation, error);
                }
            }
            if (pendingOperations.filter(op => op.type === 'add' || op.type === 'update').length === 0) {
                refreshEntities();
            }
        }
    }, [isNetworkDown, isServerDown, pendingOperations, API_URL, refreshEntities, entities]);

    useEffect(() => {
        syncPendingOperations();
    }, [syncPendingOperations]);

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
        if (isNetworkDown || isServerDown) {
            setEntities((prevEntities) => [...prevEntities, { ...entity, id: Date.now() }]); // Optimistic update with a temporary ID
            if (typeof window !== 'undefined') {
                localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(entities));
            }
            setPendingOperations((prev) => [...prev, { type: "add", payload: entity }]);
            return;
        }
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
        if (isNetworkDown || isServerDown) {
            setEntities((prevEntities) => prevEntities.filter((entity) => entity.id !== id));
            if (typeof window !== 'undefined') {
                localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(entities));
            }
            setPendingOperations((prev) => [...prev, { type: "delete", payload: id }]);
            return;
        }
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
        if (isNetworkDown || isServerDown) {
            setEntities((prevEntities) =>
                prevEntities.map((entity) =>
                    entity.id === id ? { ...entity, ...updatedEntity } : entity
                )
            );
            if (typeof window !== 'undefined') {
                localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(entities));
            }
            setPendingOperations((prev) => [...prev, { type: "update", payload: { id, data: updatedEntity } }]);
            return;
        }
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
                isNetworkDown,
                isServerDown,
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