"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

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
    { key: "name", label: "Name" },
    { key: "genre", label: "Genre" },
    { key: "status", label: "Status" },
    { key: "theme", label: "Lyrical Themes" },
    { key: "country", label: "Country" },
    { key: "label", label: "Label" },
    { key: "link", label: "Link" }
];

export default function DataGrid({ entities }: Props) {
    return (
        <div>
        <Table 
            aria-label="Metal Bands Table"
            className="border rounded-lg shadow-md overflow-hidden text-xs"
        >
            <TableHeader>
                {columns.map((column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                ))}
            </TableHeader>
            <TableBody>
                {entities.map((entity) => (
                    <TableRow key={entity.id}>
                        <TableCell>{entity.name}</TableCell>
                        <TableCell>{entity.genre}</TableCell>
                        <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${entity.status ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
                                {entity.status ? "Active" : "Disbanded"}
                            </span>
                        </TableCell>
                        <TableCell>{entity.theme}</TableCell>
                        <TableCell>{entity.country}</TableCell>
                        <TableCell>{entity.label}</TableCell>
                        <TableCell>
                            <a href={entity.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                Read more
                            </a>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </div>
    );
}   