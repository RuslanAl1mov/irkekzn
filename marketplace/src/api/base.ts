import axios from 'axios';

const $api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});

$api.interceptors.response.use(
	(config) => config,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._isRetry) {
			originalRequest._isRetry = true;
			try {
				await axios.post(
					`${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
					{},
					{ withCredentials: true }
				);
				return $api.request(originalRequest);
			} catch {
				console.warn('Not authorized');
			}
		}
		throw error;
	}
);

export default $api;