import "./App.css";
import Layout from "./components/Layout/Layout";
import { Calendar } from "./features/Calendar";

function App() {
  return (
    <Layout title={"learn Recurrence Rules"}>
      <Calendar />
    </Layout>
  );
}

export default App;
