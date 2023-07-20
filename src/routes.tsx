import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import AddEmployee from "./views/employees/AddEmployee";
import Employees from "./views/employees/Employees";
import PageNotFound from "./views/pagenotfound/PageNotFound";
import AddTeam from "./views/teams/AddTeam";
import Teams from "./views/teams/Teams";

const BaseRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Teams />} />
        <Route path="employees" element={<Employees />}></Route>
      </Route>
      <Route path=":teamID/edit" element={<AddTeam />} />
      <Route path="add" element={<AddTeam />} />
      <Route path="employees/:empID/edit" element={<AddEmployee />} />
      <Route path="employees/add" element={<AddEmployee />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default BaseRouter;
