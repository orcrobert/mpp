"use client";

import { useState } from "react";
import { useEntity } from "@/context/entitycontext";
import { useRouter } from "next/navigation";

export default function AddBandPage() {
    const { addEntity } = useEntity();
    const router = useRouter();

    const [name, setName] = useState("");
    const [genre, setGenre] = useState("");
    const [status, setStatus] = useState(true);
    const [theme, setTheme] = useState("");
    const [country, setCountry] = useState("");
    const [label, setLabel] = useState("");
    const [link, setLink] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !genre || !theme || !country || !label || !link) return;

        const newEntity = {
            id: Date.now(),
            name,
            genre,
            status,
            theme,
            country,
            label,
            link,
        };

        addEntity(newEntity);
        router.push("/");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full" />
            <input type="text" placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} className="border p-2 w-full" />
            <select value={status ? "active" : "disbanded"} onChange={(e) => setStatus(e.target.value === "active")} className="border p-2 w-full">
                <option value="active">Active</option>
                <option value="disbanded">Disbanded</option>
            </select>
            <input type="text" placeholder="Theme" value={theme} onChange={(e) => setTheme(e.target.value)} className="border p-2 w-full" />
            <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} className="border p-2 w-full" />
            <input type="text" placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} className="border p-2 w-full" />
            <input type="url" placeholder="Link" value={link} onChange={(e) => setLink(e.target.value)} className="border p-2 w-full" />
            <button type="submit" className="bg-blue-500 text-white p-2 w-full">Add Band</button>
        </form>
    );
}
