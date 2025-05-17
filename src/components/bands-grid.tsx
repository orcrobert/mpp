import { Table, Button, Checkbox, Text, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useEntity, Entity } from "@/context/entity-context";
import { useRouter } from "next/navigation";
import { toaster } from "./ui/toaster";
import { SearchBox } from "./search-box";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DataGrid() {
    const {
        entities,
        deleteEntity,
        topRated,
        averageRated,
        lowestRated,
        refreshEntities,
        isNetworkDown,
        isServerDown,
        isLoading
    } = useEntity();

    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: "asc" | "desc";
    }>({ key: "", direction: "asc" });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);

    const router = useRouter();

    useEffect(() => {
        const loadEntities = async () => {
            const result = await refreshEntities({
                search: searchQuery,
                sort: sortConfig.key as "name" | "rating" | "country" | undefined,
                order: sortConfig.direction,
                page: currentPage,
                limit: itemsPerPage,
            });

            if (result && result.total) {
                setTotalCount(result.total);
                setTotalPages(Math.ceil(result.total / itemsPerPage));
            }
        };

        loadEntities();
    }, [currentPage, searchQuery, sortConfig, refreshEntities, itemsPerPage]);

    const handleSort = (key: "name" | "rating" | "country") => {
        const newDirection = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction: newDirection });
        setCurrentPage(1);
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

        refreshEntities({
            search: searchQuery,
            sort: sortConfig.key as "name" | "rating" | "country" | undefined,
            order: sortConfig.direction,
            page: currentPage,
            limit: itemsPerPage,
        });
    };

    const handleUpdate = () => {
        if (selectedRows.length === 1) {
            router.push(`/update-band/${selectedRows[0]}`);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const getRatingClass = (entity: Entity) => {
        if (topRated?.id === entity.id) return "text-green-400";
        if (lowestRated?.id === entity.id) return "text-red-400";
        if (averageRated?.id === entity.id) return "text-yellow-400";
        return "text-gray-100";
    };

    const hasEntities = entities && entities.length > 0;

    return (
        <div>
            <SearchBox onSearch={handleSearch} />

            {(isNetworkDown || isServerDown) && (
                <div
                    style={{
                        backgroundColor: isNetworkDown ? "#fbbf24" : "#f97316",
                        color: "white",
                        padding: "0.5rem",
                        textAlign: "center",
                        marginBottom: "1rem"
                    }}
                >
                    {isNetworkDown && !isServerDown && (
                        <Text fontFamily="sans-serif" color="black" fontWeight="black" fontSize={13}>
                            ⚠️ Network connection is down. Changes will be saved locally.
                        </Text>
                    )}
                    {!isNetworkDown && isServerDown && (
                        <Text fontFamily="sans-serif" color="black" fontWeight="black" fontSize={13}>
                            ⚠️ Server is unreachable. Changes will be saved locally.
                        </Text>
                    )}
                    {isNetworkDown && isServerDown && (
                        <Text fontFamily="sans-serif" color="black" fontWeight="black" fontSize={13}>
                            ⚠️ Network and server are down. Changes will be saved locally.
                        </Text>
                    )}
                </div>
            )}

            {isLoading ? (
                <div style={{ textAlign: "center", padding: "2.5rem 0" }}>
                    <Text>Loading data...</Text>
                </div>
            ) : (
                <>
                    {hasEntities ? (
                        <Table.Root size="sm" striped marginBottom="5" marginTop="5">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader fontWeight="bold"></Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="bold" onClick={() => handleSort("name")}>
                                        Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="bold">Genre</Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="bold" onClick={() => handleSort("rating")}>
                                        Rating {sortConfig.key === "rating" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="bold">Status</Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="bold">Lyrical Themes</Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="bold" onClick={() => handleSort("country")}>
                                        Country {sortConfig.key === "country" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="bold">Label</Table.ColumnHeader>
                                    <Table.ColumnHeader fontWeight="bold">Link</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {entities.map((entity) => (
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
                                                <div
                                                    style={{
                                                        backgroundColor: "#86efac",
                                                        color: "#14532d",
                                                        padding: "0 0.5rem",
                                                        borderRadius: "0.5rem",
                                                        textAlign: "center",
                                                        fontSize: "0.75rem"
                                                    }}
                                                >
                                                    Active
                                                </div>
                                            ) : (
                                                <div
                                                    style={{
                                                        backgroundColor: "#fca5a5",
                                                        color: "#7f1d1d",
                                                        padding: "0 0.5rem",
                                                        borderRadius: "0.5rem",
                                                        textAlign: "center",
                                                        fontSize: "0.75rem"
                                                    }}
                                                >
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
            ) : (
            <div style={{ textAlign: "center", padding: "2.5rem 0" }}>
                <Text>No bands found matching your criteria.</Text>
            </div>
          )}

            <Flex justify="space-between" align="center" mt={4}>
                <Flex gap={4}>
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
                </Flex>

                {hasEntities && (
                    <Flex align="center" gap={2}>
                        <Button
                            aria-label="Previous page"
                            size="sm"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1 || isLoading}
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <Text>Page {currentPage} of {totalPages || 1}</Text>
                        <Button
                            aria-label="Next page"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages || isLoading || entities.length < itemsPerPage}
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </Flex>
                )}
            </Flex>
        </>
    )
}
    </div >
  );
}