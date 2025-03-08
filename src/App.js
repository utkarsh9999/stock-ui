import './App.css';
import {BrowserRouter as Router , Routes,Route} from "react-router-dom";
import Stocks from "./Stocks";
import {StockBuy} from "./StockBuy";
import {StockSell} from "./StockSell";
import {TransactionStats} from "./TransactionStats";
require('bootstrap')
function App() {

  return (
    <Router>
        <Routes>
            {/*<Route path="/" element={<Home />} />*/}
            <Route path="/" element={<Stocks />} />
            <Route path="/stock/buy/:stock_id" element={<StockBuy />} />
            <Route path="/stock/sell/:stock_id" element={<StockSell />} />
            <Route path="/transaction-stats" element={<TransactionStats/>}></Route>
        </Routes>
    </Router>
  );
}

export default App;
