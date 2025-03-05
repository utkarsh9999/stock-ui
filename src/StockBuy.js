import React, {useEffect, useState} from "react";
import Navbar from "./components/Navbar";
import { useParams } from 'react-router-dom';
import axios from "axios";
import socketIO from "socket.io-client";

const socket=socketIO.connect('http://localhost:5000');
export const StockBuy=()=>{
    const {stock_id}=useParams();
    const [stock,set_stock]=useState({});
    const [quantity,set_quantity]=useState(0);
    const [display,set_display]=useState('none');
    async function getstock(){
        await axios.get(`http://localhost:5000/api/stocks/stock/${stock_id}`).then((response)=>{
            console.log(response.data);
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
                <h1 className="text-center">Buy Stock </h1>
                <h3 className="text-center"><label style={{fontSize:"18px"}}>Stock Code : &nbsp;<label className="badge">{stock_id}</label></label></h3>
                <div className="row">
                    <div className="col-lg-4 col-md-4">
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <div className="panel panel-default">
                            <div className="panel-heading">Buy Stock </div>
                            <div className="panel-body">
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
                    <div className="col-lg-4 col-md-4">

                    </div>
                </div>
            </div>
        </>
    )
}