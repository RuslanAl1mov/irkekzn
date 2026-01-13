export const Loader = ({
	width,
	color = 'black',
}: {
	width: number;
	color?: string;
}) => {
	return (
		<div
			style={{
				width: `${width}px`,
				borderWidth: `${width / 7}px`,
				borderColor: color,
				borderBottomColor: 'transparent',
			}}
			className='loader'
		/>
	);
};
