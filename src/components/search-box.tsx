import { Box, Input, Heading } from "@chakra-ui/react"

export function SearchBox({ onSearch }: { onSearch: (query: string) => void }) {
    return (
        <Box marginTop="6" marginBottom="6" backgroundColor="gray.950" p={6} pt={3} pb={4} borderRadius={6}>
            <Box display="flex" gap={3}>
                <Heading fontWeight="bold" fontSize={16} marginBottom={3}>Search Database</Heading>
                <Box fontSize={25}>🔍</Box>
            </Box>
            <Input
                placeholder="Search"
                variant="outline"
                onChange={(e) => onSearch(e.target.value)}
                borderRadius={6}
            />
        </Box>
    );
}