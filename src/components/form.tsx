"use client"

import { useState, useEffect } from "react";
import { Button, Input, Stack, Field, NativeSelect, Flex, Heading } from "@chakra-ui/react";

type BandFormProps = {
    onSubmit: (data: { name: string, genre: string, status: boolean, theme: string, country: string, label: string, link: string }) => void;
    initialData?: { name: string, genre: string, status: boolean, theme: string, country: string, label: string, link: string };
    isUpdateMode?: boolean;
};

const BandForm = ({ onSubmit, initialData, isUpdateMode }: BandFormProps) => {
    const [name, setName] = useState(initialData?.name || "");
    const [genre, setGenre] = useState(initialData?.genre || "");
    const [status, setStatus] = useState(initialData?.status ?? true);
    const [theme, setTheme] = useState(initialData?.theme || "");
    const [country, setCountry] = useState(initialData?.country || "");
    const [label, setLabel] = useState(initialData?.label || "");
    const [link, setLink] = useState(initialData?.link || "");

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setStatus(value === "active");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !genre || !theme || !country || !label || !link) return;

        const newBand = {
            name,
            genre,
            status,
            theme,
            country,
            label,
            link,
        };

        onSubmit(newBand);
    };

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            height="80vh"
        >
            <Heading marginBottom={10} fontSize="3xl" fontWeight="black">{isUpdateMode ? "Update Band" : "Add band"}</Heading>
            <form onSubmit={handleSubmit}>
                <Stack gap={4}>
                    <Field.Root required>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={isUpdateMode ? "Change the band name" : "Band Name"}
                        />
                        <Field.HelperText>{isUpdateMode ? "Change the band name." : "Enter the band name."}</Field.HelperText>
                    </Field.Root>

                    <Field.Root required>
                        <Input
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            placeholder={isUpdateMode ? "Change the genre" : "Genre"}
                        />
                        <Field.HelperText>{isUpdateMode ? "Change the band's genre." : "Enter the band's genre."}</Field.HelperText>
                    </Field.Root>

                    <Field.Root required>
                        <NativeSelect.Root size="xs" variant="plain" width="auto" me="-1">
                            <NativeSelect.Field value={status ? "active" : "disbanded"} onChange={handleStatusChange} fontSize="sm">
                                <option value="active">Active</option>
                                <option value="disbanded">Disbanded</option>
                            </NativeSelect.Field>
                        </NativeSelect.Root>
                        <Field.HelperText>{isUpdateMode ? "Change the band's status." : "Select whether the band is active or disbanded."}</Field.HelperText>
                    </Field.Root>

                    <Field.Root required>
                        <Input
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            placeholder={isUpdateMode ? "Change the lyrical theme" : "Lyrical Theme"}
                        />
                        <Field.HelperText>{isUpdateMode ? "Change the band's lyrical theme." : "Enter the band's lyrical theme."}</Field.HelperText>
                    </Field.Root>

                    <Field.Root required>
                        <Input
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder={isUpdateMode ? "Change the country" : "Country"}
                        />
                        <Field.HelperText>{isUpdateMode ? "Change the country the band is from." : "Enter the country the band is from."}</Field.HelperText>
                    </Field.Root>

                    <Field.Root required>
                        <Input
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder={isUpdateMode ? "Change the record label" : "Label"}
                        />
                        <Field.HelperText>{isUpdateMode ? "Change the band's record label." : "Enter the band's record label."}</Field.HelperText>
                    </Field.Root>

                    <Field.Root required>
                        <Input
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            type="url"
                            placeholder={isUpdateMode ? "Change the link" : "Link to your band"}
                        />
                        <Field.HelperText>{isUpdateMode ? "Change the link for the band's official page." : "Enter a link for the band's official page."}</Field.HelperText>
                    </Field.Root>

                    <Button type="submit" colorScheme="blue">
                        {isUpdateMode ? "Update Band" : "Add Band"}
                    </Button>
                </Stack>
            </form>
        </Flex>
    );
};

export default BandForm;
