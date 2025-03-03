// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import Login from './components/authentication/Login';
// import Signup from './components/authentication/Signup';
// import AdminDashboard from './pages/AdminDashboard';
// import Home from "./pages/home/Home"; 

// function App() {
//   return (
//     <AuthProvider> {/* ✅ Wrap app with authentication context */}
//       <Router>
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/register" element={<Signup />} /> 
//           <Route path="/admin/*" element={<AdminDashboard />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="home" element={<Home />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/authentication/Login";
import Signup from "./components/authentication/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/home/Home";

function App() {
  return (
    <AuthProvider> {/* ✅ Wrap app with authentication context */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admin/*" element={<AdminDashboard />} /> {/* ✅ Nested routes */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
