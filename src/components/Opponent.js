/** @jsx jsx */
import { jsx, Text, Flex, Box, Heading } from 'theme-ui';

function Opponent({ name, words }) {
    return (
        <Flex sx={{ flexDirection: 'column' }}>
            <Heading>{name}</Heading>
            <Box></Box>
        </Flex>
    );
}

export default Opponent;
