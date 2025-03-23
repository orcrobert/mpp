import { Box, Input, Heading } from "@chakra-ui/react"

export function SearchBox({ onSearch }: { onSearch: (query: string) => void }) {
    return (
        <Box marginTop="6" marginBottom="6" backgroundColor="gray.950" p={3} borderRadius={6}>
            <Input
                placeholder="Search"
                variant="outline"
                onChange={(e) => onSearch(e.target.value)}
                borderRadius={6}
            />
        </Box>
    );
}