import Test from "./Pages/Test/Test";
import Login from "./Pages/Login/Login";
import Create from "./Pages/Create/Create";
import Results from "./Pages/Results/Results";
import AdminLanding from "./Pages/Admin/AdminLanding"
import StudentData from "./Pages/Admin/StudentData"
import Resources from "./Pages/Admin/Resources"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
function App() {
  return (
    <div className="App bg-gray-100">
      <BrowserRouter>
          <div className={''}>
            <Routes>
              <Route path={'/'} element={<Login />}/>
              <Route path={'/test'} element={<Test />}/>
              <Route path={'/create'} element={<Create />}/>
              <Route path={'/results'} element={<Results />}/>
              <Route path={'/adminLanding'} element={<AdminLanding />}/>
              <Route path={'/studentData'} element={<StudentData />}/>
              <Route path={'/resources'} element={<Resources />}/>
            </Routes>
          </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
