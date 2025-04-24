import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import ReportsPage from "./pages/ReportPage";
import { PATHS } from "./utils/constants";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route path={PATHS.REPORTS} element={<ReportsPage />} />
      </Route>
    </Routes>
  );
}
