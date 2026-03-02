import cls from "./Dashboard.module.css";
import { motion } from "framer-motion";
import { StatisticCard } from "@/shared/ui/statisticCard/StatisticCard";


const DashboardPage = () => {

  return (
    <main className="main">
      <motion.div  initial="hidden" animate="visible" className="mainBlock">

        <div className={cls.mainDashboardInfo}>
          <StatisticCard
            title="Товары"
            value={1}
            progressPercentage={12}
          />
          <StatisticCard
            title="Категории"
            value={2}
            progressPercentage={22}
          />
          <StatisticCard
            title="Запросы на звонок"
            value={3}
            progressPercentage={33}
          />
        </div>
      </motion.div>
    </main>
  );
};

export default DashboardPage;
