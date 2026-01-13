export interface IUser {
	id: number;
	email: string;
	phone: string;
	first_name: string;
	last_name: string;
	username: string;
	photo: string;
	role: string;
	is_staff: string;
	is_active: boolean;
	date_joined: string;
	is_archived: boolean;
	permissions: string;
}
