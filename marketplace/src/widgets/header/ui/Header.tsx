import cls from "./Header.module.css"


export const Header = () => {
    return ( 
        <header className={cls.header}>
            <div className={cls.headerAdvertLine}></div>
            <div className={cls.headerBlock}>
                <div className={cls.headerContendBlock}></div>
                <div className={cls.headerContendBlock}></div>
                <div className={cls.headerContendBlock}></div>
            </div>
        </header>
     );
}