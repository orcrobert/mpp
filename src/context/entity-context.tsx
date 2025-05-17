"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
// Socket.IO disabled for now
// import { io, Socket } from 'socket.io-client';

export type Album = {
    id: number;
    name: string;
    releaseYear: number;
    rating: number;
    bandId: number;
};

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
    albums?: Album[];
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
    addAlbum: (bandId: number, album: Omit<Album, "id" | "bandId">) => Promise<void>;
    getAlbums: (bandId: number) => Promise<Album[]>;
    topRated: Entity | null;
    averageRated: Entity | null;
    lowestRated: Entity | null;
    chartData: ChartData;
    refreshEntities: (params?: FetchEntitiesParams) => Promise<{ total: number, page: number, limit: number } | null>;
    isNetworkDown: boolean;
    isServerDown: boolean;
    isLoading: boolean;
};

const EntityContext = createContext<EntityContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "pendingEntitiesOperations";
const LOCAL_STORAGE_CACHE_KEY = "cachedEntities";

type PendingOperation =
    | { type: "add"; payload: Omit<Entity, "id"> }
    | { type: "delete"; payload: number }
    | { type: "update"; payload: { id: number; data: Partial<Entity> } };

const ITEMS_PER_PAGE = 10;

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
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [chartData, setChartData] = useState<ChartData>({
        genreDistribution: [],
        ratingsDistribution: [],
        topRatedEntities: [],
    });
    const [isNetworkDown, setIsNetworkDown] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
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

    // Use the Next.js proxy route instead of direct backend URL to avoid mixed content errors
    const API_URL = `/api/proxy/entities`;
    // Socket.IO disabled for now
    // const WS_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    useEffect(() => {
        // Socket.IO connection disabled for now
        /*
        // Only attempt Socket.IO connection in the browser
        if (typeof window === 'undefined') return;
        
        const socket: Socket = io(WS_URL, {
            reconnectionAttempts: 5,
            timeout: 10000,
            transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
        });

        socket.on('connect', () => {
            console.log("Socket.IO connected:", socket.id);
            setIsServerDown(false);
        });

        socket.on('initial_entities', (data: Entity[]) => {
            setEntities(data);
            setInitialLoad(false);
        });

        socket.on('new_entity', (data: Entity) => {
            setEntities((prevEntities) => [...prevEntities, data]);
        });

        socket.on('entity_updated', (data: Entity) => {
            setEntities((prevEntities) =>
                prevEntities.map((entity) =>
                    entity.id === data.id ? data : entity
                )
            );
        });

        socket.on('entity_deleted', (id: number) => {
            setEntities((prevEntities) => prevEntities.filter((entity) => entity.id !== id));
        });

        socket.on('disconnect', () => {
            console.log("Socket.IO disconnected");
        });

        socket.on('connect_error', (error) => {
            console.error("Socket.IO connection error:", error);
            // Don't mark server as down immediately for socket errors
            // We'll rely on the API health check for that
        });

        return () => {
            socket.disconnect();
        };
        */
    }, []);  // Removed WS_URL dependency since it's not used

    const checkServerStatus = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/health`);
            setIsServerDown(!response.ok);
        } catch (error) {
            setIsServerDown(true);
        }
    }, [API_URL]);

    useEffect(() => {
        // Only run in browser
        if (typeof window === 'undefined') return;
        
        const handleOnline = () => setIsNetworkDown(false);
        const handleOffline = () => setIsNetworkDown(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // Updated refreshEntities function for pagination
    const refreshEntities = useCallback(async (params: FetchEntitiesParams = {}) => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (params.search) queryParams.append("search", params.search);
            if (params.sort) queryParams.append("sort", params.sort);
            if (params.order) queryParams.append("order", params.order);

            // Use the passed page number or default to 1
            const pageNumber = params.page || 1;
            const itemsPerPage = params.limit || ITEMS_PER_PAGE;

            queryParams.append("page", pageNumber.toString());
            queryParams.append("limit", itemsPerPage.toString());

            console.log("Fetching entities with params:", queryParams.toString());
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
                return null;
            } else {
                const data = await res.json();
                console.log("API Response:", data);

                if (data && Array.isArray(data.data)) {
                    setEntities(data.data);
                    if (typeof window !== 'undefined' && pageNumber === 1) {
                        localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(data.data));
                    }
                    setIsServerDown(false);

                    // Return pagination metadata
                    return {
                        total: data.total || 0,
                        page: data.page || pageNumber,
                        limit: data.limit || itemsPerPage
                    };
                }
                setIsServerDown(false);
                return null;
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
            return null;
        } finally {
            setIsLoading(false);
            setInitialLoad(false);
        }
    }, [API_URL]);

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
                        if (response?.ok) {
                            setPendingOperations((prev) => prev.filter((op) => op !== operation));
                        }
                    } else if (operation.type === "delete") {
                        response = await fetch(`${API_URL}/${operation.payload}`, { method: "DELETE" });
                        if (response?.ok) {
                            setPendingOperations((prev) => prev.filter((op) => op !== operation));
                            setEntities((prevEntities) =>
                                prevEntities.filter((entity) => entity.id !== operation.payload)
                            );
                            if (typeof window !== 'undefined') {
                                localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(entities));
                            }
                        }
                    } else if (operation.type === "update") {
                        response = await fetch(`${API_URL}/${operation.payload.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(operation.payload.data),
                        });
                        if (response?.ok) {
                            setPendingOperations((prev) => prev.filter((op) => op !== operation));
                        }
                    }

                    if (!response?.ok) {
                        console.error("Failed to sync operation:", operation, await response?.text());
                    }
                } catch (error) {
                    console.error("Error syncing operation:", operation, error);
                }
            }
            refreshEntities();
        }
    }, [isNetworkDown, isServerDown, pendingOperations, API_URL, refreshEntities, entities]);

    useEffect(() => {
        syncPendingOperations();
    }, [syncPendingOperations]);

    useEffect(() => {
        if (initialLoad) {
            refreshEntities();
        }
    }, [refreshEntities, initialLoad]);

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
                refreshEntities();
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
            setPendingOperations((prev) => [...prev, { type: "delete", payload: id }]);
            return;
        }
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (res.ok) {
                setEntities((prevEntities) => prevEntities.filter((entity) => entity.id !== id));
                if (typeof window !== 'undefined') {
                    localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(entities));
                }
            } else {
                console.error(await res.text());
            }
        } catch (error) {
            console.error("Failed to delete entity", error);
        }
    };

    const updateEntity = async (id: number, updatedEntity: Partial<Entity>) => {
        if (isNetworkDown || isServerDown) {
            setPendingOperations((prev) => [...prev, { type: "update", payload: { id, data: updatedEntity } }]);
            return;
        }
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedEntity),
            });
            if (!res.ok) {
                console.error(await res.text());
            }
        } catch (error) {
            console.error("Failed to update entity", error);
        }
    };

    const addAlbum = async (bandId: number, album: Omit<Album, "id" | "bandId">) => {
        try {
            const response = await fetch(`${API_URL.replace('/entities', '')}/bands/${bandId}/albums`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(album),
            });

            if (!response.ok) {
                throw new Error('Failed to add album');
            }

            const newAlbum = await response.json();
            setEntities((prevEntities) =>
                prevEntities.map((entity) =>
                    entity.id === bandId
                        ? {
                            ...entity,
                            albums: [...(entity.albums || []), newAlbum],
                        }
                        : entity
                )
            );
        } catch (error) {
            console.error('Error adding album:', error);
            throw error;
        }
    };

    const getAlbums = async (bandId: number): Promise<Album[]> => {
        try {
            const response = await fetch(`${API_URL.replace('/entities', '')}/bands/${bandId}/albums`);
            if (!response.ok) {
                throw new Error('Failed to fetch albums');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching albums:', error);
            return [];
        }
    };

    return (
        <EntityContext.Provider
            value={{
                entities,
                addEntity,
                deleteEntity,
                updateEntity,
                addAlbum,
                getAlbums,
                topRated,
                averageRated,
                lowestRated,
                chartData,
                refreshEntities,
                isNetworkDown,
                isServerDown,
                isLoading,
            }}
        >
            {children}
        </EntityContext.Provider>
    );
}

export function useEntity() {
    const context = useContext(EntityContext);
    if (context === undefined) {
        throw new Error("useEntity must be used within an EntityProvider");
    }
    return context;
}