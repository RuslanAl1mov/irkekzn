import cls from "./Profile.module.css";

import { Title } from "@/widgets/title";
import { useAuthStore } from "@/entities/user";
import UserImage from "@/assets/app/user.jpg";
import cn from "classnames";
import { formatPhoneNumber } from "@/shared/lib/formater";
import { UserLogsList } from "@/shared/ui/user-logs";


export const Profile = () => {
    const { user } = useAuthStore();

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = UserImage;
    };

    return (
        <section className={cls.section}>
            <div className={cls.titleBlock}>
                <Title
                    title="Информация профиля"
                    subTitle="Управляйте данными вашей учетной записи"
                />
            </div>

            <div className={cls.content}>
                {/* Блок с аватаром и именем пользователя */}
                <div className={cls.profileBlock}>

                    {/* Блок с фото и статусом пользователя */}
                    <div className={cls.userInfoBlock}>
                        <div className={cls.userPhotoNameBlock}>
                            <div className={cls.profileAvatarBlock}>
                                <img src={user?.photo ?? UserImage} onError={handleImageError} alt="User photo" className={cls.profileAvatarImage} />
                            </div>
                            <div className={cls.profileNameBlock}>
                                <p className={cls.profileName}>{user?.first_name} {user?.last_name}</p>
                                <p className={cls.profileSecondaryText} title="username">{user?.username}</p>

                                <div className={cls.userContactsBlock}>
                                    <div className={cls.userContactItem}>
                                        <p className={cls.userContactItemTitle}>Почта (Логин)</p>
                                        <p className={cls.userContactItemValue}>{user?.email}</p>
                                    </div>
                                    <div className={cls.userContactItem}>
                                        <p className={cls.userContactItemTitle}>Телефон</p>
                                        <p className={cls.userContactItemValue}>{formatPhoneNumber(user?.phone_number ?? "")}</p>
                                    </div>
                                    <div className={cls.userContactItem}>
                                        <p className={cls.userContactItemTitle}>Язык</p>
                                        <p className={cls.userContactItemValue}>{user?.language == "ru" ? "Русский" : "English"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Статус пользователя */}
                        <div className={cn(cls.userStatusBlock, user?.is_active ? cls.userStatusBlock__active : cls.userStatusBlock__inactive)}>
                            {user?.is_active ? "Активен" : "Неактивен"}
                        </div>
                    </div>
                </div>

                <div className={cn(cls.contentBlock, cls.contentBlock__100_25)}>
                    <div className={cls.contentBlockItem}>
                        <Title
                            title="Общие данные"
                            size="h4"
                            subTitle="Общие данные видны всем пользователям"
                        />
                    </div>

                    <div className={cls.contentBlockItem}>
                        <Title
                            title="Действия"
                            size="h4"
                            subTitle="Ваши недавние действия"
                        />
                        <div className={cls.logsBlock}>
                            <UserLogsList userId={user?.id ?? null} />
                        </div>
                    </div>
                </div>


            </div>
        </section>
    );
}
