// bands-grid.tsx
import { Table, Button, Box, Checkbox, Text } from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import { useEntity } from "@/context/entity-context";
import { useRouter } from "next/navigation";
import { toaster } from "./ui/toaster";
import { SearchBox } from "./search-box";

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

export type Props = {
    entities: Entity[];
};

const ITEMS_PER_PAGE = 8;

export default function DataGrid({ entities: initialEntities }: Props) {
    const {
        deleteEntity,
        topRated,
        averageRated,
        lowestRated,
        refreshEntities,
        isNetworkDown,
        isServerDown,
    } = useEntity();
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const [entities, setEntities] = useState(initialEntities);
    const router = useRouter();

    useEffect(() => {
        setEntities(initialEntities);
    }, [initialEntities]);

    const handleSort = (key: "name" | "rating" | "country") => {
        const newDirection = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction: newDirection });
        setCurrentPage(1); // Reset page on sort
        refreshEntities({
            search: searchQuery,
            sort: key,
            order: newDirection as "asc" | "desc",
            page: 1,
            limit: ITEMS_PER_PAGE,
        });
    };

    const toggleRowSelection = (id: number) => {
        setSelectedRows((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((rowId) => rowId !== id) : [...prevSelected, id]
        );
    };

    const handleDelete = () => {
        selectedRows.forEach((id) => {
            deleteEntity(id);
        });
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
            router.push(`/update-band/${selectedRows[0]}`);
        }
    };

    const filteredEntities = useMemo(() => {
        const searchQueryLower = searchQuery.toLowerCase();
        return entities.filter((entity) =>
            Object.values(entity).some((value) =>
                value.toString().toLowerCase().includes(searchQueryLower)
            )
        );
    }, [entities, searchQuery]);

    const getRatingClass = (entity: Entity) => {
        if (topRated?.id === entity.id) return "text-green-400";
        if (lowestRated?.id === entity.id) return "text-red-400";
        if (averageRated?.id === entity.id) return "text-yellow-400";
        return "text-gray-100";
    };

    const totalPages = Math.ceil(filteredEntities.length / ITEMS_PER_PAGE);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (totalPages === 0) {
            setCurrentPage(1);
        }
    }, [filteredEntities, totalPages, currentPage]);

    const paginatedEntities = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredEntities.slice(startIndex, endIndex);
    }, [filteredEntities, currentPage]);

    return (
        <div>
            <SearchBox onSearch={setSearchQuery} />

            {(isNetworkDown || isServerDown) && (
                <Box
                    bg={isNetworkDown ? "yellow.400" : "orange.400"}
                    color="white"
                    p={2}
                    textAlign="center"
                    mb={4}
                >
                    {isNetworkDown && !isServerDown && (
                        <Text>⚠️ Network connection is down. Changes will be saved locally.</Text>
                    )}
                    {!isNetworkDown && isServerDown && (
                        <Text>⚠️ Server is unreachable. Changes will be saved locally.</Text>
                    )}
                    {isNetworkDown && isServerDown && (
                        <Text>⚠️ Network and server are down. Changes will be saved locally.</Text>
                    )}
                </Box>
            )}

            <Table.Root size="sm" striped marginBottom="5" marginTop="5">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader key="select" fontWeight="bold"></Table.ColumnHeader>
                        <Table.ColumnHeader key="name" fontWeight="bold" onClick={() => handleSort("name")}>
                            Name
                        </Table.ColumnHeader>
                        <Table.ColumnHeader key="genre" fontWeight="bold">Genre</Table.ColumnHeader>
                        <Table.ColumnHeader key="rating" fontWeight="bold" onClick={() => handleSort("rating")}>
                            Rating
                        </Table.ColumnHeader>
                        <Table.ColumnHeader key="status" fontWeight="bold">Status</Table.ColumnHeader>
                        <Table.ColumnHeader key="theme" fontWeight="bold">Lyrical Themes</Table.ColumnHeader>
                        <Table.ColumnHeader key="country" fontWeight="bold" onClick={() => handleSort("country")}>Country</Table.ColumnHeader>
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
                            <Table.Cell className={getRatingClass(entity)} fontWeight="black">
                                {entity.rating}
                            </Table.Cell>
                            <Table.Cell>
                                {entity.status ? (
                                    <Box
                                        bg="green.300"
                                        color="green.900"
                                        px={2}
                                        py={0}
                                        borderRadius="lg"
                                        textAlign="center"
                                        fontSize="xs"
                                    >
                                        Active
                                    </Box>
                                ) : (
                                    <Box
                                        bg="red.300"
                                        color="red.900"
                                        px={2}
                                        py={0}
                                        borderRadius="lg"
                                        textAlign="center"
                                        fontSize="xs"
                                    >
                                        Inactive
                                    </Box>
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

            <div className="flex justify-between gap-4 mt-4">
                <Button
                    borderRadius={8}
                    colorPalette="red"
                    backgroundColor="red.500"
                    size="xs"
                    onClick={handleDelete}
                    disabled={selectedRows.length === 0}
                >
                    Delete Selected
                </Button>
                <div className="flex justify-center gap-4 mt-4">
                    <Button
                        size="xs"
                        rounded="xl"
                        p={2}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </Button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        size="xs"
                        rounded="xl"
                        p={2}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
                <Button
                    borderRadius={8}
                    colorPalette="blue"
                    backgroundColor="blue.500"
                    size="xs"
                    onClick={handleUpdate}
                    disabled={selectedRows.length !== 1}
                >
                    Update Selected
                </Button>
            </div>
        </div>
    );
}