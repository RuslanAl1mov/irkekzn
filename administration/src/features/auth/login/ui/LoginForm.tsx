import cls from './LoginForm.module.css';

import LogoIcon from "@/assets/logo/irke_logo_black.svg";
import MailIcon from "@/assets/icons/mail.svg?react";
import PasswordIcon from "@/assets/icons/lock.svg?react";
import EyeOpenIcon from "@/assets/icons/eye_open.svg?react";
import EyeCloseIcon from "@/assets/icons/eye_close.svg?react";

import { useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { useLogin } from '../model/useLogin';

import { Button, Input } from '@/shared/ui';
import { toast } from 'react-toastify';


export const LoginForm = () => {

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("")
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const [error, setError] = useState("");

	const navigate = useNavigate();

	const { mutate, isPending} = useLogin({
		onSuccess: () => {
			setError("");
			toast.success("Добро пожаловать!")
			void navigate("/", { replace: true });
		},
		onError: (error) => {
			setError(String(error.message));
  			toast.error(error.message);
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
		<form className={cls.loginForm} onSubmit={handleSubmit}>
			{/* Логотип */}
			<div className={cls.logoBlock}>
				<img src={LogoIcon} alt="Logo" className={cls.logo} />
			</div>

			{/* Поля ввода */}
			<div className={cls.inputsBlock}>
				<Input
					className={cls.input}
					type="email"
					name="email"
					placeholder="example@email.com"
					startIcon={<MailIcon />}
					value={email}
					setValue={(value) => {
						setError("");
						setEmail(value);
					}}
					showClearButton
					error={!!error}
				/>
				<Input
					className={cls.input}
					type={showPassword ? "text" : "password"}
					name="password"
					placeholder={"Ваш пароль"}
					startIcon={<PasswordIcon />}
					value={password}
					setValue={(value) => {
						setError("");
						setPassword(value);
					}}
					endIcon={showPassword ?
						<EyeCloseIcon className={cls.eyeIcon} onClick={() => setShowPassword(!showPassword)} />
						: <EyeOpenIcon className={cls.eyeIcon} onClick={() => setShowPassword(!showPassword)} />
					}
					error={!!error}
				/>
			</div>

			{/* Кнопки входа */}
			<div className={cls.btnsBlock}>
				<Button isLoading={isPending} size='full'>Войти</Button>
			</div>
		</form>
	);
};
