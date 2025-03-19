import { render, screen } from "@testing-library/react";
import { EntityProvider, useEntity } from "@/context/entity-context";
import { useEffect, useState } from "react";
import userEvent from "@testing-library/user-event";

const TestComponent = () => {
    const { entities, addEntity, updateEntity, deleteEntity, topRated, averageRated, lowestRated } = useEntity();
    const [entityCount, setEntityCount] = useState(entities.length);

    useEffect(() => {
        setEntityCount(entities.length);
    }, [entities]);

    const handleAdd = () => {
        addEntity({
            id: 11,
            name: "Test Band",
            genre: "Experimental Metal",
            rating: 8.5,
            status: true,
            theme: "Abstract Concepts",
            country: "Nowhere",
            label: "None",
            link: "#",
        });
    };

    const handleUpdate = () => {
        updateEntity(1, {
            id: 1,
            name: "Fleshgod Apocalypse (Updated)",
            genre: "Technical Death Metal",
            rating: 10,
            status: true,
            theme: "Philosophy",
            country: "Italy",
            label: "Nuclear Blast",
            link: "https://www.metal-archives.com/bands/Fleshgod_Apocalypse/113185",
        });
    };

    const handleDelete = () => {
        deleteEntity(1);
        deleteEntity(2);
        deleteEntity(10);
    };

    return (
        <div>
            <p data-testid="entity-count">{entityCount}</p>
            <p data-testid="top-rated">{topRated ? topRated.name : "None"}</p>
            <p data-testid="average-rated">{averageRated ? averageRated.name : "None"}</p>
            <p data-testid="lowest-rated">{lowestRated ? lowestRated.name : "None"}</p>

            <button onClick={handleDelete}>Delete Entity</button>
            <button onClick={handleAdd}>Add Entity</button>
            <button onClick={handleUpdate}>Update Entity</button>
        </div>
    );
};

describe("EntityContext", () => {

    test("deleteEntity removes an entity from the list", async () => {
        render(
            <EntityProvider>
                <TestComponent />
            </EntityProvider>
        );

        const entityCountElement = screen.getByTestId("entity-count");
        expect(entityCountElement).toHaveTextContent("10");

        const deleteButton = screen.getByText("Delete Entity");
        await userEvent.click(deleteButton);

        expect(entityCountElement).toHaveTextContent("7");
    });

    test("addEntity adds a new entity to the list", async () => {
        render(
            <EntityProvider>
                <TestComponent />
            </EntityProvider>
        );

        const entityCountElement = screen.getByTestId("entity-count");
        expect(entityCountElement).toHaveTextContent("10");

        const addButton = screen.getByText("Add Entity");
        await userEvent.click(addButton);

        expect(entityCountElement).toHaveTextContent("11");
    });

    test("updateEntity modifies an existing entity", async () => {
        render(
            <EntityProvider>
                <TestComponent />
            </EntityProvider>
        );

        const updateButton = screen.getByText("Update Entity");
        await userEvent.click(updateButton);

        expect(screen.getByTestId("top-rated")).toHaveTextContent("Fleshgod Apocalypse (Updated)");
    });

    test("ratings update correctly when entities change", async () => {
        render(
            <EntityProvider>
                <TestComponent />
            </EntityProvider>
        );

        expect(screen.getByTestId("top-rated")).toHaveTextContent("Dark Tranquillity");
        expect(screen.getByTestId("average-rated")).toBeTruthy();
        expect(screen.getByTestId("lowest-rated")).toHaveTextContent("Gojira");

        const updateButton = screen.getByText("Update Entity");
        await userEvent.click(updateButton);

        expect(screen.getByTestId("top-rated")).toHaveTextContent("Fleshgod Apocalypse (Updated)");
    });
});
