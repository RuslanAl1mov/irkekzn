import style from './LoginForm.module.css';

import { Button, Input } from '@/shared/ui';
import type { FormEvent } from 'react';

import MailIcon from '@mui/icons-material/MailOutlineRounded';
import LockIcon from '@mui/icons-material/LockOutlined';
import { useLogin } from '../model/useLogin';

// Лого
import LogoIcon from "@/assets/logo/irke_logo_black.svg";


export const LoginForm = () => {
	const { mutate, isPending } = useLogin({
		onSuccess: () => { },
		onError: (error) => {
			alert(error.response?.data.error);
		},
	});

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		mutate({ email, password });
	}

	return (
		<form className={style.loginForm} onSubmit={handleSubmit}>
			{/* Логотип */}
			<div className={style.logoBlock}>
				<img src={LogoIcon} alt="ARDS Lux logo" className={style.logo} />
			</div>

			{/* Поля ввода */}
			<div className={style.inputsBlock}>
				<Input
					type='email'
					placeholder='Почта'
					name='email'
					required
					icon={<MailIcon />}
				/>
				<Input
					type='password'
					isPassword
					placeholder='Пароль'
					name='password'
					required
					icon={<LockIcon />}
				/>
			</div>

			{/* Кнопки входа */}
			<div className={style.btnsBlock}>
				<Button isLoading={isPending} size='full'>Войти</Button>
			</div>
		</form>
	);
};
