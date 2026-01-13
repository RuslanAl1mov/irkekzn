import type { ComponentPropsWithoutRef, FC, PropsWithChildren } from 'react';
import cls from './Button.module.css';
import classNames from 'classnames';
import { Loader } from '../loader/Loader';

interface Props extends PropsWithChildren<ComponentPropsWithoutRef<'button'>> {
	className?: string;
	size?: 'full';
	isLoading?: boolean;
}

export const Button: FC<Props> = (props) => {
	const { className, children, size, isLoading } = props;

	return (
		<button
			className={classNames(cls.btn, {
				className,
				[cls.full]: size === 'full',
				[cls.withLoading]: isLoading,
			})}>
			{isLoading && <Loader width={20} />}
			{children}
		</button>
	);
};
