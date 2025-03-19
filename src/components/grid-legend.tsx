import { Text, Heading, Box } from "@chakra-ui/react";

const Legend = () => {
    return (
        <Box marginTop={5}>
            <Heading marginBottom={3}>Grid Statistics Legend</Heading>
            <Box marginLeft={6}>
                <Text color="green.400" fontWeight="medium">Top rated band</Text>
                <Text color="yellow.400" fontWeight="medium">Average rated band</Text>
                <Text color="red.400" fontWeight="medium">Lowest rated band</Text>
            </Box>
        </Box>
    )
}

export default Legend;