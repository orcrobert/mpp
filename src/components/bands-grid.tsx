import { Table, Button, Flex, Checkbox } from "@chakra-ui/react";
import { useState } from "react";
import { useEntity } from "@/context/entity-context";
import { useRouter } from "next/navigation";
import { toaster } from "./ui/toaster";
import { SearchBox } from "./search-box";

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

type Props = {
    entities: Entity[];
};

const columns = [
    { key: "select", label: "Select" },
    { key: "name", label: "Name" },
    { key: "genre", label: "Genre" },
    { key: "status", label: "Status" },
    { key: "theme", label: "Lyrical Themes" },
    { key: "country", label: "Country" },
    { key: "label", label: "Label" },
    { key: "link", label: "Link" },
];

export default function DataGrid({ entities }: Props) {

    const { deleteEntity } = useEntity();
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const toggleRowSelection = (id: number) => {
        setSelectedRows((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((rowId) => rowId !== id)
                : [...prevSelected, id]
        );
    };

    const handleDelete = () => {
        selectedRows.forEach((id) => deleteEntity(id));
        setSelectedRows([]);
        toaster.create({
            title: "Band Deleted",
            description: "The band has been deleted successfully.",
            type: "success",
            duration: 2000,
        });
    };

    const handleUpdate = () => {
        if (selectedRows.length === 1) {
            const selectedId = selectedRows[0];
            const updateUrl = `/update-band/${selectedId}`;
            router.push(updateUrl);
        }
    };

    return (
        <div>
            <SearchBox onSearch={setSearchQuery} />
            <Table.Root size="sm" striped marginBottom="5" marginTop="5">
                <Table.Header>
                    <Table.Row>
                        {columns.map((column) => (
                            <Table.ColumnHeader fontWeight="bold" key={column.key}>
                                {column.label}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {entities
                        .filter((entity) => entity.genre.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((entity) => (
                            <Table.Row key={entity.id}>
                                <Table.Cell>
                                    <Checkbox.Root
                                        variant="solid"
                                        onChange={() => toggleRowSelection(entity.id)}
                                        checked={selectedRows.includes(entity.id)}
                                    >
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                    </Checkbox.Root>
                                </Table.Cell>
                                <Table.Cell>{entity.name}</Table.Cell>
                                <Table.Cell>{entity.genre}</Table.Cell>
                                <Table.Cell>
                                    {entity.status ? (
                                        <div className="bg-green-300 text-green-900 px-2 py-2 rounded-full text-xs text-center">
                                            Active
                                        </div>
                                    ) : (
                                        <div className="bg-red-300 text-red-900 px-2 py-2 rounded-full text-xs text-center">
                                            Inactive
                                        </div>
                                    )}
                                </Table.Cell>
                                <Table.Cell>{entity.theme}</Table.Cell>
                                <Table.Cell>{entity.country}</Table.Cell>
                                <Table.Cell>{entity.label}</Table.Cell>
                                <Table.Cell>
                                    <a
                                        href={entity.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        More
                                    </a>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                </Table.Body>
            </Table.Root>
            <div className="flex items-center justify-center gap-2 pt-12">
                <Button colorPalette="red" size="xs" onClick={handleDelete} disabled={selectedRows.length === 0}>
                    Delete Selected
                </Button>
                <Button colorPalette="blue" size="xs" onClick={handleUpdate} disabled={selectedRows.length != 1}>
                    Update Selected
                </Button>
            </div>
        </div>
    );
}
