/** @jsx jsx */
import { jsx, Text, Flex, Box, Heading } from 'theme-ui';

function Word({ children }) {
    return <Text>{children}</Text>;
}

function Opponent({ name, words }) {
    console.log({ name, words });
    return (
        <Box>
            <Heading>{name}</Heading>
            <Flex>
                {words.map((word, i) => (
                    <Word key={`${word}-${i}`}>{word}</Word>
                ))}
            </Flex>
        </Box>
    );
}

export default Opponent;
