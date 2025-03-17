import { Box, Text, HStack } from "@chakra-ui/react";

const Footer = () => {
    return (
        <Box as="footer" py={2} textAlign="center" color="gray.500" pt={10} pb={5}>
            <HStack justify="center" gap={2}>
                <Text fontWeight="light" fontSize="sm" color="gray.900" _dark={{ color: "gray.100" }}>
                    Orban Robert
                </Text>
                <Text>&copy; {new Date().getFullYear()}</Text>
            </HStack>
        </Box>
    );
};

export default Footer;
