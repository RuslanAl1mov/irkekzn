import "./DashboardPage.css";

import { useContext } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { subDays, format, startOfToday } from "date-fns";

import { getDashboardInfo, ApiResponse } from "api/admin";

import FiltersBlockList from "components/filters/filtersBlockList/FiltersBlockList";
import SummaryComponent from "components/summary/summaryComponent/SummaryComponent";
import SummaryBlock from "components/summary/summaryBlock/SummaryBlock";
import DateFilter from "components/filters/filterComponent/DateFilter";
import PageTitle from "components/title/pageTitle/PageTitle";

import { FiltersContext } from "context/FiltersContext";

const containerFade = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const ymd = (d?: Date): string => (d ? format(d, "yyyy-MM-dd") : "");

const DashboardPage = () => {
  const filters = useContext(FiltersContext);
  if (!filters) throw new Error("FiltersContext is not provided");

  const [fromDate, toDate] = filters.dateRange;

  const today = startOfToday();
  const defaultFrom = subDays(today, 31);

  let effectiveFrom = fromDate ?? defaultFrom;
  let effectiveTo = toDate ?? today;

  const dateAfter = ymd(effectiveFrom);
  const dateBefore = ymd(effectiveTo);

  const { data: dashboardResponse } = useQuery<ApiResponse>({
    queryKey: ["DashboardFinInfo", dateAfter, dateBefore],
    queryFn: () =>
      getDashboardInfo({
        dateAfter,
        dateBefore,
      }),
    staleTime: 5 * 60 * 60 * 1000,
    gcTime: 5 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return (
    <main className="main">
      <motion.div
        variants={containerFade}
        initial="hidden"
        animate="visible"
        className="mainBlock"
      >
        <PageTitle>Главная</PageTitle>

        <FiltersBlockList>
          <DateFilter />
        </FiltersBlockList>

        <SummaryBlock>
          <SummaryComponent
            title="Товары"
            value={dashboardResponse?.result.products.total ?? 0}
            progressPercentage={dashboardResponse?.result.products.diff ?? 0}
            dateAfter={dateAfter}
            dateBefore={dateBefore}
          />
          <SummaryComponent
            title="Категории"
            value={dashboardResponse?.result.categories.total ?? 0}
            progressPercentage={dashboardResponse?.result.categories.diff ?? 0}
            dateAfter={dateAfter}
            dateBefore={dateBefore}
          />
          <SummaryComponent
            title="Запросы на звонок"
            value={dashboardResponse?.result.call_requests.total ?? 0}
            progressPercentage={dashboardResponse?.result.call_requests.diff ?? 0}
            dateAfter={dateAfter}
            dateBefore={dateBefore}
          />
        </SummaryBlock>
      </motion.div>
    </main>
  );
};

export default DashboardPage;
