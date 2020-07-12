/** @jsx jsx */
import { jsx, Text } from 'theme-ui';
import { forwardRef, Fragment } from 'react';

const Input = forwardRef(({ label, id, error, ...props }, ref) => {
    console.log('errors: ', error);
    return (
        <Fragment>
            {label && (
                <label
                    sx={{ color: 'primary' }}
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                ref={ref}
                maxLength="20"
                {...props}
            />
            <br />
            {error && (
                <Text
                    py={2}
                    sx={{
                        fontSize: theme => theme.fontSizes[0],
                        color: 'error'
                    }}
                >
                    {error.message}
                </Text>
            )}
        </Fragment>
    );
});

export default Input;
