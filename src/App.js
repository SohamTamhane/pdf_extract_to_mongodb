import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/admin' element={<Admin/>}/>
            </Routes>
        </BrowserRouter>
    )
}
export default App;