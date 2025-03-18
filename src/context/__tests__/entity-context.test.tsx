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

    const handleDelete = () => {
        deleteEntity(1);
        deleteEntity(2);
        deleteEntity(10);
    };

    return (
        <div>
            <p data-testid="entity-count">{entityCount}</p>
            <button onClick={handleDelete}>Delete Entities</button>
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

        const deleteButton = screen.getByText("Delete Entities");
        await userEvent.click(deleteButton);

        expect(entityCountElement).toHaveTextContent("7");
    });
});
