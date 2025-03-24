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

const ITEMS_PER_PAGE = 8;

export default function DataGrid({ entities }: Props) {
    const { deleteEntity, topRated, averageRated, lowestRated } = useEntity();
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortedEntities, setSortedEntities] = useState<Entity[]>(entities);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
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

    const totalPages = Math.ceil(filteredEntities.length / ITEMS_PER_PAGE);
    const paginatedEntities = filteredEntities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div>
            <SearchBox onSearch={setSearchQuery} />
            <Table.Root size="sm" striped marginBottom="5" marginTop="5">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader key="select" fontWeight="bold"> </Table.ColumnHeader>
                        <Table.ColumnHeader key="name" fontWeight="bold" onClick={() => handleSort("name")}>Name</Table.ColumnHeader>
                        <Table.ColumnHeader key="genre" fontWeight="bold" onClick={() => handleSort("genre")}>Genre</Table.ColumnHeader>
                        <Table.ColumnHeader key="rating" fontWeight="bold" onClick={() => handleSort("rating")}>Rating</Table.ColumnHeader>
                        <Table.ColumnHeader key="status" fontWeight="bold">Status</Table.ColumnHeader>
                        <Table.ColumnHeader key="theme" fontWeight="bold">Lyrical Themes</Table.ColumnHeader>
                        <Table.ColumnHeader key="country" fontWeight="bold">Country</Table.ColumnHeader>
                        <Table.ColumnHeader key="label" fontWeight="bold">Label</Table.ColumnHeader>
                        <Table.ColumnHeader key="link" fontWeight="bold">Link</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {paginatedEntities.map((entity) => (
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
                            <Table.Cell>
                                <a href={entity.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    More
                                </a>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
            
            <div className="flex justify-between gap-4 mt-4">
                <Button borderRadius={8} colorPalette="red" backgroundColor="red.500" size="xs" onClick={handleDelete} disabled={selectedRows.length === 0}>
                    Delete Selected
                </Button>
                <div className="flex justify-center gap-4 mt-4">
                    <Button size="xs" rounded="xl" p={2} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                        Prev
                    </Button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <Button size="xs" rounded="xl" p={2} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                        Next
                    </Button>
                </div>
                <Button borderRadius={8} colorPalette="blue" backgroundColor="blue.500" size="xs" onClick={handleUpdate} disabled={selectedRows.length !== 1}>
                    Update Selected
                </Button>
            </div>
        </div>
    );
}
