import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { TelemetryDashboardPage } from "./pages/TelemetryDashboardPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TelemetryDashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
