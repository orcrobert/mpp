import { Input } from "@chakra-ui/react"

export function SearchBox({ onSearch }: { onSearch: (query: string) => void }) {
    return (
        <Input
            placeholder="Search"
            variant="outline"
            marginTop="6"
            onChange={(e) => onSearch(e.target.value)}
        />
    );
}