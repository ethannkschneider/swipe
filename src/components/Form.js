/** @jsx jsx */
import { jsx } from 'theme-ui';

function Form({ children, onSubmit, ...props }) {
    return (
        <div className="w-full max-w-xs m-auto">
            <form
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={onSubmit}
                noValidate
            >
                {children}
            </form>
        </div>
    );
}

export default Form;
