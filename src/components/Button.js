/** @jsx jsx */
import { jsx } from 'theme-ui';
import classnames from 'classnames';

function Button({ children, className, ...props }) {
    return (
        <button
            sx={{
                display: 'block'
            }}
            className={classnames(
                className,
                'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            )}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
