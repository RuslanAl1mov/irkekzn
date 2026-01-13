import { motion } from "framer-motion";
import { Skeleton } from "@mui/material";
import styles from "./StatisticCard.module.css";

import cn from 'classnames';
import { formatNumberWithSpaces } from "@/utils/formatNumberWithSpaces";
import { dateFormater } from "@/utils/dateFormater";

// Иконки как React-компоненты (требуется vite-plugin-svgr в vite.config.ts)
import ArrowUpIcon from "@/assets/icons/link-arrow.svg?react";
import TrendUpIcon from "@/assets/icons/trend-up-icon.svg?react";

interface StatisticCardProps {
  title: string;
  value?: number;
  link?: string | null;
  progressPercentage?: number | null;
  dateAfter?: string | null;
  dateBefore?: string | null;
  isColored?: boolean;
  className?: string;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  link = null,
  progressPercentage = null,
  dateAfter = null,
  dateBefore = null,
  isColored = false,
  className = "",
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={cn(styles.wrapper, isColored && styles.wrapperColored, className)}
    >
      <div className={styles.inner}>
        <div className={styles.row}>
          <p className={cn(styles.title, isColored && styles.titleColored)}>{title}</p>
          {link && (
            <a className={cn(styles.link, isColored && styles.linkColored)} href={link} aria-label="Open link">
              <ArrowUpIcon />
            </a>
          )}
        </div>

        <div className={styles.row}>
          <p className={cn(styles.value, isColored && styles.valueColored)}>
            {value !== undefined ? (
              (() => {
                const [intPart, fracPart] = value.toFixed(2).split(".");
                const formattedInt = formatNumberWithSpaces(intPart);
                return fracPart === "00" ? formattedInt : `${formattedInt}.${fracPart}`;
              })()
            ) : (
              <Skeleton height={28} width={200} />
            )}
          </p>

          {progressPercentage != null && (
            <div className={styles.percentageBlock}>
              <div className={cn(styles.percentageIconText, progressPercentage < 0 && styles.percentageIconTextDecrease)}>
                <TrendUpIcon />
                <p className={cn(styles.percentageValue, progressPercentage < 0 && styles.percentageValueDecrease)}>
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
