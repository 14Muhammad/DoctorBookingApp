import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import {useSelector} from "react-redux";

function App() {
    const {loading} = useSelector(state => state.alerts);
    return (
        <BrowserRouter>
            {loading && (<div className="spinner-parent">
                <div className="spinner-border" role="status">
                </div>
            </div>)}
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <Routes>
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/' element={<Home/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
