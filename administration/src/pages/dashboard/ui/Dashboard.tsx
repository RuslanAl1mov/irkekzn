import style from "./Dashboard.module.css";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

// import FiltersBlockList from "@/components/filters/filtersBlockList/FiltersBlockList";
import { StatisticCard } from "@/shared/ui/statisticCard/StatisticCard";
// import DateFilter from "@/components/filters/filterComponent/DateFilter";
// import PageTitle from "@/components/title/pageTitle/PageTitle";

import { getDashboard } from "../api/dashboard.api";
import type { IDashboard } from "@/pages/dashboard/model/types";



const DashboardPage = () => {

  return (
    <main className="main">
      <motion.div  initial="hidden" animate="visible" className="mainBlock">
        {/* <PageTitle>Главная</PageTitle> */}
        {/* <FiltersBlockList>
          <DateFilter />
        </FiltersBlockList> */}

        <div className={style.mainDashboardInfo}>
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
