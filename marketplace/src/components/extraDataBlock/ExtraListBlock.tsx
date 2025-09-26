import React from "react";
import cn from "classnames";
import styles from "./ExtraListBlock.module.css";


interface ListItem {
    link: string | null;
    text: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
    lined?: boolean;
    fullLink?: boolean;
}

interface ExtraListBlockProps {
    width?: string;
    title?: string;
    icon?: React.ReactNode;
    listItems?: ListItem[];
}

const ExtraListBlock: React.FC<ExtraListBlockProps> = ({
    width = "100%",
    title = "",
    icon = null,
    listItems = [],
}) => {
    return (
        <div className={styles.box} style={{ width }}>
            {title && <div className={styles.titleBlock}>{icon && icon}<p className={styles.title}>{title}</p></div>}

            <ul className={styles.list}>

                {listItems.map((data, i) => (
                    <li key={i} className={cn(styles.listItem, data.className, data.lined && styles.listItemLined, data.fullLink && styles.listItem__NoPadding)}>
                        {data.link ? (
                            <a href={data.link} className={cn(styles.itemLink, data.fullLink && styles.itemLink_Full)}>
                                {data.icon && data.icon}
                                {data.text}
                            </a>
                        ) : (
                            <p className={styles.itemText}>{data.text}</p>
                        )}

                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExtraListBlock;
