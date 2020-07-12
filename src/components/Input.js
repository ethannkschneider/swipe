/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Fragment } from 'react';

function Input({ label, id, ...props }) {
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
                {...props}
            />
        </Fragment>
    );
}

export default Input;
