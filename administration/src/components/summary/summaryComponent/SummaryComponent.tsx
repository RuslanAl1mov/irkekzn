import { motion } from "framer-motion";
import { Skeleton } from "@mui/material";
import styles from "./SummaryComponent.module.css";

import { formatNumberWithSpaces } from "utils/formatNumberWithSpaces";
import { dateFormater } from "utils/dateFormater";


interface SummaryComponentProps {
  title: string;
  value?: number;
  currency?: string;
  link?: string | null;
  progressPercentage?: number | null;
  dateAfter?: string | null;
  dateBefore?: string | null;
  isColored?: boolean;
  className?: string;
}

const SummaryComponent: React.FC<SummaryComponentProps> = ({
  title,
  value,
  currency = "",
  link = null,
  progressPercentage = null,
  dateAfter = null,
  dateBefore = null,
  isColored = false,
  className = "",
}) => {
  return (
    <motion.div
      variants={itemFade}
      className={`${styles.wrapper} ${isColored ? styles.wrapperColored : ""} ${className}`}
    >
      <div className={styles.inner}>
        <div className={styles.row}>
          <p className={`${styles.title} ${isColored ? styles.titleColored : ""}`}>
            {title}
          </p>
          {link && (
            <a className={`${styles.link} ${isColored ? styles.linkColored : ""}`} href={link}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M1 1H11V11" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </div>

        <div className={styles.row}>
          <p className={`${styles.value} ${isColored ? styles.valueColored : ""}`}>
            {value !== undefined ? (
              (() => {
                const [intPart, fracPart] = value.toFixed(2).split(".");
                const formattedInt = formatNumberWithSpaces(intPart);
                const result =
                  fracPart === "00" ? formattedInt : `${formattedInt}.${fracPart}`;
                return `${currency}${result}`;
              })()
            ) : (
              <Skeleton height={28} width={200} />
            )}
          </p>

          {progressPercentage != null && (
            <div className={styles.percentageBlock}>
              <div
                className={`${styles.percentageIconText} ${
                  progressPercentage < 0 ? styles.percentageIconTextDecrease : ""
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18" fill="none">
                  <path
                    d="M3.69486 13.8772L6.3881 9.40491L11.3412 12.1085L15.381 5.40007"
                    strokeWidth={1.4}
                    strokeMiterlimit={5.759}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.625 6.0545L15.4604 5.40007L16.2992 8.05244"
                    strokeWidth={1.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p
                  className={`${styles.percentageValue} ${
                    progressPercentage < 0 ? styles.percentageValueDecrease : ""
                  }`}
                >
                  {progressPercentage >= 0 ? progressPercentage : progressPercentage * -1}%
                </p>
              </div>
              {dateAfter && <p className={styles.dateRange}>С {dateFormater(dateAfter)}</p>}
              {dateBefore && <p className={styles.dateRange}>По {dateFormater(dateBefore)}</p>}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const itemFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default SummaryComponent;
