import { Text, Heading, Box } from "@chakra-ui/react";

const Legend = () => {
    return (
        <>
            <Heading marginBottom={3}>Grid Legend</Heading>
            <Box marginLeft={3}>
                <Text color="green.400" fontWeight="medium">Top rated band</Text>
                <Text color="yellow.400" fontWeight="medium">Average rated band</Text>
                <Text color="red.400" fontWeight="medium">Lowest rated band</Text>
            </Box>
        </>
    )
}

export default Legend;