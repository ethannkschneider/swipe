/** @jsx jsx */
import { jsx } from 'theme-ui';

import { Heading } from 'theme-ui';

function Title({ children }) {
    return (
        <div>
            <Heading
                as="h1"
                p={3}
                sx={{
                    fontSize: theme => theme.fontSizes[5]
                }}
                className="text-center"
            >
                {children}
            </Heading>
        </div>
    );
}

export default Title;
