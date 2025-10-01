import PropTypes from 'prop-types';
import "./Checkbox.css";

const Checkbox = ({
    setValue = null,
    value = false,
    name = null,
    title = ""
}) => {
    return (
        <div className="dti-checkbox-block" onClick={() => { if (setValue) { setValue(!value) } }} title={title}>
            <div className={`dti-checkbox ${value && "dti-checkbox--checked"}`} title={title}>
                {value && (
                    <svg className="dti-checkbox-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 10" fill="none" title={title}>
                        <path d="M4.28572 10C4.06017 10 3.84005 9.9049 3.67972 9.73487L0.253012 6.09797C-0.548638 5.20748 0.747589 4.02015 1.465 4.81266L4.24767 7.76656L10.4978 0.305444C11.237 -0.573522 12.5169 0.636857 11.7777 1.51294L4.92432 9.69452C4.76671 9.88184 4.54388 9.99135 4.31017 10C4.30202 10 4.29387 10 4.28572 10Z" fill="white" />
                    </svg>
                )}
            </div>
            {name ? <span className="dti-checkbox-label" title={name}>{name}</span> : ""}
            
        </div>
    );
};

Checkbox.propTypes = {
    setValue: PropTypes.func,
    value: PropTypes.bool,
    label: PropTypes.string,
};


export default Checkbox;
