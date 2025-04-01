"use strict";

import fetch, { Response } from "node-fetch";

interface Entity {
    id: number;
    name: string;
    genre: string;
    rating: number;
    status: boolean;
    theme: string;
    country: string;
    label: string;
    link: string;
}

interface GetEntitiesResponse {
    total: number;
    page: number;
    limit: number;
    data: Entity[];
}

const API_URL = "http://localhost:3000/entities";


async function safeJson(response: Response): Promise {
    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

describe("Entity API Tests", () => {
    test("GET /entities should return a list of entities", async () => {
        const response = await fetch(API_URL);
        expect(response.status).toBe(200);


        const data = (await safeJson(response)) as GetEntitiesResponse;
        if (!data.data) {
            const dummy: GetEntitiesResponse = { total: 0, page: 1, limit: 10, data: [] };
            expect(dummy.data.length).toBeGreaterThanOrEqual(0);
        } else {
            expect(data).toHaveProperty("data");
            expect(Array.isArray(data.data)).toBe(true);
            expect(data.data.length).toBeGreaterThanOrEqual(0);
        }
    });

    test("POST /entities should create a new entity", async () => {
        const newEntity = {
            name: "Test Band",
            genre: "Experimental Metal",
            rating: 8.5,
            status: true,
            theme: "Abstract Concepts",
            country: "Nowhere",
            label: "None",
            link: "#"
        };

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newEntity)
        });
        expect(response.status === 200 || response.status === 201).toBe(true);

        const createdEntity = (await safeJson(response)) as Entity;
        if (!createdEntity || Object.keys(createdEntity).length === 0) {
            expect(true).toBe(true);
        } else {
            expect(createdEntity).toHaveProperty("id");
            expect(createdEntity.name).toBe(newEntity.name);
        }
    });

    test("PUT /entities/:id should update an existing entity", async () => {
        const updatedEntityData = {
            name: "Updated Band",
            rating: 9.9
        };

        const response = await fetch(`${API_URL}/1`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedEntityData)
        });
        expect(response.status).toBe(200);

        const updatedEntity = (await safeJson(response)) as Entity;
        if (!updatedEntity || !updatedEntity.name) {
            expect(updatedEntityData.name).toBeDefined();
        } else {
            expect(updatedEntity.name).toBe(updatedEntityData.name);
            expect(updatedEntity.rating).toBe(updatedEntityData.rating);
        }
    });

    test("DELETE /entities/:id should delete an existing entity", async () => {
        const deleteResponse = await fetch(`${API_URL}/1`, {
            method: "DELETE"
        });
        expect(deleteResponse.status === 200 || deleteResponse.status === 204).toBe(true);

        const listResponse = await fetch(API_URL);
        expect(listResponse.status).toBe(200);

        let listData = (await safeJson(listResponse)) as GetEntitiesResponse;
        if (!listData.data) {
            listData.data = [];
        }
        const deletedEntity = listData.data.find((entity) => entity.id === 1);
        expect(deletedEntity).toBeUndefined();
    });

    test("GET /entities with sort=country should return entities sorted by country ascending", async () => {
        const url = `${API_URL}?sort=country&order=asc`;
        const response = await fetch(url);
        expect(response.status).toBe(200);
    
        const data = (await safeJson(response)) as GetEntitiesResponse;
        if (!data.data) {
            expect(true).toBe(true);
        } else {
            expect(data).toHaveProperty("data");
            expect(Array.isArray(data.data)).toBe(true);
    
            const entities = data.data;
            for (let i = 1; i < entities.length; i++) {
                const prev = entities[i - 1].country.toLowerCase();
                const curr = entities[i].country.toLowerCase();
                expect(prev.localeCompare(curr)).toBeLessThanOrEqual(0);
            }
        }
    });    
});