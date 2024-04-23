import "./App.css";
import Layout from "./components/Layout/Layout";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import RouterConfig from "@src/app/RouterConfig";

import { Calendar } from "./features/Calendar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={RouterConfig.DashboardPage}
          element={
            <Layout title={"Learn Recurrence Rules"}>
              <Calendar />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
