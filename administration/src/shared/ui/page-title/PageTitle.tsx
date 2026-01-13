import style from "PageTitle.module.css";

interface Props {
    text: string;
}

export const PagTitle = ({ text="Page title" }) => {
    return ( 
        <h1 className={style.title}>
        </h1>
     );
}
 