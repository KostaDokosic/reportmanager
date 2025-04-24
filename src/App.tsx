import ReportProvider from "./providers/ReportProvider";
import Router from "./router";

export default function App() {
  return (
    <ReportProvider>
      <Router />
    </ReportProvider>
  );
}
