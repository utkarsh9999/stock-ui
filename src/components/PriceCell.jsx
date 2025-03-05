import React from "react";
import {useState,useEffect} from "react";
import axios from "axios";
import socketIOClient from 'socket.io-client';
const ENDPOINT = 'http://localhost:5000';

export const PriceCell = ({ stock }) => {
    const [price, set_price] = useState(stock['stock_price']);
    const [quantity,set_quantity]=useState(stock['stock_quantity_left']);
    const [bgcol,set_bgcol]=useState('#c8af00');
    useEffect(() => {
        const socket = socketIOClient.connect(ENDPOINT);
        socket.on('stock_inc', (data) => {
            if(stock['stock_id']===data.stock['stock_id']){
                console.log(data.stock['stock_price']);
                if(data.stock['stock_price']>price)
                {
                    console.log('increase');
                    set_bgcol('green');
                }
                else if(data.stock['stock_price']===price)
                {
                    console.log('increase');
                    set_bgcol('#c8af00');
                }
                set_price(data.stock['stock_price']);
                set_quantity(data.stock['stock_quantity_left']);
            }
        });
        socket.on('stock_sell', (stockdata) => {
            if(stock['stock_id']===stockdata.stock['stock_id']){
                console.log(stockdata.stock['stock_price']);
                if(stockdata.stock['stock_price']<price)
                {
                    console.log('increase');
                    set_bgcol('red');
                }
                else if(stockdata.stock['stock_price']===price)
                {
                    console.log('increase');
                    set_bgcol('#c8af00');
                }
                set_price(stockdata.stock['stock_price']);
                set_quantity(stockdata.stock['stock_quantity_left']);
            }
        });
        return () => {
            console.log('disconnecting');
            socket.disconnect(); // Disconnect on unmount
        };
    }, [stock]);

    return (
        <>
            <td style={{backgroundColor:bgcol,color:"white"}}>{price}</td>
            <td>{quantity}</td>
        </>

    );
};