"use client";

import { useState } from "react";
import { useEntity } from "@/context/entitycontext";
import { useRouter } from "next/navigation";
import { Button, Input, Stack, Field, NativeSelect, Flex, Heading } from "@chakra-ui/react";

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

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setStatus(value === "active");
    };

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
        <Flex
            direction="column"
            align="center"
            justify="center"
            height="80vh"
        >
            <Heading marginBottom={10} fontSize="3xl" fontWeight="black">Add band</Heading>
            <form onSubmit={handleSubmit} className="w-100">
                <Stack gap={4}>
                    <Field.Root required>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Band Name"
                        />
                        <Field.HelperText>Enter the band name.</Field.HelperText>
                    </Field.Root>

                    <Field.Root required>
                        <Input
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            placeholder="Genre"
                        />
                        <Field.HelperText>Enter the band's genre.</Field.HelperText>
                    </Field.Root>

                    <Field.Root required>
                        <NativeSelect.Root size="xs" variant="plain" width="auto" me="-1">
                            <NativeSelect.Field value={status ? "active" : "disbanded"} onChange={handleStatusChange} fontSize="sm">
                                <option value="active">Active</option>
                                <option value="disbanded">Disbanded</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        <Field.HelperText>Select whether the band is active or disbanded.</Field.HelperText>
                    </Field.Root>

                    <Field.Root required>
                        <Input
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            placeholder="Lyrical Theme"
                        />
                        <Field.HelperText>Enter the band's lyrical theme.</Field.HelperText>
                    </Field.Root>

                    <Field.Root required>
                        <Input
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Country"
                        />
                        <Field.HelperText>Enter the country the band is from.</Field.HelperText>
                    </Field.Root>

                    <Field.Root required>
                        <Input
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="Label"
                        />
                        <Field.HelperText>Enter the band's record label.</Field.HelperText>
                    </Field.Root>

                    <Field.Root required>
                        <Input
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            type="url"
                            placeholder="Link to your band"
                        />
                        <Field.HelperText>Enter a link for the band's official page.</Field.HelperText>
                    </Field.Root>

                    <Button type="submit" colorScheme="blue">
                        Add Band
                    </Button>
                </Stack>
            </form>
        </Flex>
    );
}
