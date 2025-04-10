// src/App.jsx
import AppRoutes from "./component/AppRoutes";
import Navbar from "./component/Navbar";

function App() {
  return (
    <div className="bg-[#F1E9E9] text-[#1b1b18] w-screen min-h-screen overflow-x-hidden">
      <Navbar />
      <AppRoutes />
    </div>
  );
}

export default App;
