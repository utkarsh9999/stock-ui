import React, {useEffect, useState} from "react";
import Navbar from "./components/Navbar";
import { useParams } from 'react-router-dom';
import axios from "axios";
import socketIO from "socket.io-client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);




const socket=socketIO.connect('http://localhost:5000');
export const StockBuy=()=>{
    const [data,set_data] =useState( {
      labels: [],
      datasets: [
        {
          label: "Stock",
          data: [4000, 3000, 5000, 7000, 6000],
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
          pointBackgroundColor: "rgba(75,192,192,1)",
          tension: 0.1, // Smooth curve
        },
      ],
    });
    const {stock_id}=useParams();
    const [stock,set_stock]=useState({});
    const [quantity,set_quantity]=useState(0);
    const [display,set_display]=useState('none');
    const [transactions,set_transactions]=useState([]);
    async function getstock(){
        await axios.get(`http://localhost:5000/api/stocks/stock/${stock_id}`).then(async (response)=>{
            console.log(response.data);
            let url=`http://localhost:5000/api/stocks/transactions/${response.data.stock_id}`;
            console.log(url);
            await axios.get(url).then((response)=>{
                console.log(`Transactions : `,response.data);
                set_data({...data,labels: response.data.map((res)=>res['transaction_time'])});
                set_data(prevData => ({
                    ...prevData,  // Keep existing labels
                    datasets: [
                        {
                            ...prevData.datasets[0],
                            data: response.data.map((trstats)=>trstats['transaction_amount'])
                        }
                    ]
                }));
            });
            set_stock(response.data);
        });
    }
    useEffect(()=>{
        getstock();
    },[]);

    function buyStock(){
        set_display('block');
        socket.emit('stock_change',{
            stock_id:stock['stock_id'],
            stock_code:stock['stock_company_code'],
            stock_company_name:stock['stock_company_name'],
            type:'BUY',
            quantity:quantity
        });
        setTimeout(()=>{
            set_display('none')
        },2000)
    }
    function change_q(e){
        set_quantity(e.target.value);
    }

    return(
        <>
            <Navbar/>
            <div className="container">
                <h3 className="text-center">
                    <label style={{fontSize:"18px"}}>Stock Code : &nbsp;
                        <label className="badge">{stock_id}</label>
                    </label>
                </h3>
                <div className="row">
                    <div className="col-lg-3 col-md-3">
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="panel panel-default">
                            <div className="panel-heading">Buy Stock </div>
                            <div className="panel-body">
                                {data.labels.length>0?
                                    <Line data={data} />:<label>Loading . . . </label>
                                }

                                <form className="form">
                                    <div className="form-group" style={{display:display}}>
                                        <div className="alert alert-success">Bid Successful</div>
                                    </div>
                                    <div className="form-group">
                                        <label>{stock['stock_company_name']}</label>
                                    </div>
                                    <div className="form-group">
                                        <label>Stock Price : </label>
                                    </div>
                                    <div className="form-group">
                                        <label>Quantity</label>
                                        <input type="number" className="form-control"
                                               value={quantity}
                                               onChange={change_q}
                                               placeholder="Quantity"/>
                                    </div>
                                    <div className="form-group" style={{display:"flex",justifyContent:"right"}}>
                                        <button type="button"
                                                onClick={buyStock}
                                                className="btn btn-primary btn-sm">Buy</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3">

                    </div>
                </div>
            </div>
        </>
    )
}