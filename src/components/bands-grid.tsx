import { Table, Button, Box, Checkbox } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useEntity } from "@/context/entity-context";
import { useRouter } from "next/navigation";
import { toaster } from "./ui/toaster";
import { SearchBox } from "./search-box";
import { Input, Stack, Field, NativeSelect, Heading } from "@chakra-ui/react";

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

type Props = {
    entities: Entity[];
};

const columns = [
    { key: "select", label: "" },
    { key: "name", label: "Name" },
    { key: "genre", label: "Genre" },
    { key: "rating", label: "Rating" },
    { key: "status", label: "Status" },
    { key: "theme", label: "Lyrical Themes" },
    { key: "country", label: "Country" },
    { key: "label", label: "Label" },
    { key: "link", label: "Link" },
];

export default function DataGrid({ entities }: Props) {

    const { deleteEntity, topRated, averageRated, lowestRated } = useEntity();
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortedEntities, setSortedEntities] = useState<Entity[]>(entities);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const router = useRouter();

    const handleSort = (columnKey: string) => {
        let direction = 'asc';
        if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key: columnKey, direction });

        const sorted = [...entities].sort((a, b) => {
            const aValue = a[columnKey as keyof Entity];
            const bValue = b[columnKey as keyof Entity];

            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setSortedEntities(sorted);
    };

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

    const filteredEntities = useMemo(() => {
        return sortedEntities.filter((entity) => {
            const searchQueryLower = searchQuery.toLowerCase();
            return (
                entity.name.toLowerCase().includes(searchQueryLower) ||
                entity.genre.toLowerCase().includes(searchQueryLower) ||
                entity.rating.toString().includes(searchQueryLower) ||
                entity.status.toString().toLowerCase().includes(searchQueryLower) ||
                entity.theme.toLowerCase().includes(searchQueryLower) ||
                entity.country.toLowerCase().includes(searchQueryLower) ||
                entity.label.toLowerCase().includes(searchQueryLower) ||
                entity.link.toLowerCase().includes(searchQueryLower)
            );
        });
    }, [sortedEntities, searchQuery]);

    const getRatingClass = (entity: Entity) => {
        if (topRated?.id === entity.id) return "text-green-400";
        if (lowestRated?.id === entity.id) return "text-red-400";
        if (averageRated?.id === entity.id) return "text-yellow-400";
        return "text-gray-100";
    };

    return (
        <div>
            <SearchBox onSearch={setSearchQuery} />
            <Table.Root size="sm" striped marginBottom="5" marginTop="5">
                <Table.Header>
                    <Table.Row>
                        {columns.map((column) => {
                            if (column.key === 'select' || column.key === 'link') {
                                return (
                                    <Table.ColumnHeader key={column.key} fontWeight="bold">
                                        {column.label}
                                    </Table.ColumnHeader>
                                );
                            }

                            return (
                                <Table.ColumnHeader
                                    key={column.key}
                                    fontWeight="bold"
                                    onClick={() => handleSort(column.key)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {column.label}
                                    {sortConfig.key === column.key ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ''}
                                </Table.ColumnHeader>
                            );
                        })}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {filteredEntities.map((entity) => (
                        <Table.Row key={entity.id}>
                            <Table.Cell paddingLeft={2}>
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
                            <Table.Cell className={getRatingClass(entity)} fontWeight="black">{entity.rating}</Table.Cell>
                            <Table.Cell>
                                {entity.status ? (
                                    <Box className="bg-green-300 text-green-900" px={2} py={0} rounded="lg" textAlign="center" fontSize="xs">
                                        Active
                                    </Box>
                                ) : (
                                    <Box className="bg-red-300 text-red-900" px={2} py={0} rounded="lg" textAlign="center" fontSize="xs">
                                        Inactive
                                    </Box>
                                )}
                            </Table.Cell>
                            <Table.Cell>{entity.theme}</Table.Cell>
                            <Table.Cell>{entity.country}</Table.Cell>
                            <Table.Cell>{entity.label}</Table.Cell>
                            <Table.Cell paddingRight={5}>
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
                <Button colorPalette="blue" size="xs" onClick={handleUpdate} disabled={selectedRows.length !== 1}>
                    Update Selected
                </Button>
            </div>
        </div>
    );
}
