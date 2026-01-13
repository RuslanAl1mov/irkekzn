import {
	useState,
	type ComponentPropsWithoutRef,
	type FC,
	type ReactNode,
} from 'react';
import classNames from 'classnames';

import cls from './Input.module.css';
import VisibilityOnIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';

interface Props extends ComponentPropsWithoutRef<'input'> {
	icon?: ReactNode;
	isPassword?: boolean;
}

export const Input: FC<Props> = ({
	type = 'text',
	icon,
	isPassword,
	...props
}) => {
	const [inputType, setInputType] = useState(() => type);

	function handleSeePassword() {
		if (inputType === 'password') setInputType('text');
		else setInputType('password');
	}

	return (
		<div className={classNames(cls.inputCont, { [cls.withIcon]: !!icon })}>
			{icon}
			<div
				className={classNames(cls.input, {
					[cls.password]: isPassword,
				})}>
				<input type={inputType} {...props} />
				{isPassword && (
					<button
						type='button'
						className={cls.eyeBtn}
						onClick={handleSeePassword}>
						{(inputType === 'password') ? <VisibilityOffIcon /> : <VisibilityOnIcon />}
					</button>
				)}
			</div>
		</div>
	);
};
