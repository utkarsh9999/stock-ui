import React, {useEffect, useState} from "react";
import Navbar from "./components/Navbar";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

Chart.register(ArcElement, Tooltip, Legend);
export function TransactionStats(){
    const [data,set_Data] = useState({
    labels: ["Red", "Blue", "Yellow"],
        datasets: [
              {
                    label: "Total Transactions",
                    data: [30, 50, 20],
                    backgroundColor: [
                      "#FF5733", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF",
                      "#FF6384", "#C9CBCF", "#E7E9ED", "#76D7C4", "#F39C12"
                    ],
                    hoverBackgroundColor: [
                      "#E64A19", "#2F86E5", "#EBCB56", "#388E3C", "#7E57C2",
                      "#D32F2F", "#B0BEC5", "#CFD8DC", "#48C9B0", "#E67E22"
                    ]
              },
        ],
    });
    const options = {
        responsive: true,
        plugins: {
              legend: {
                position: "top",
              },
        },
    };
    useEffect(()=>{
        async function getStats(){
            await axios.get(`http://localhost:5000/api/stocks/trans-stats`).then((response)=>{
                console.log(response.data);
                const labels=response.data.map((trstats)=>trstats['stock_company_name']);
                set_Data({...data,labels: labels});
                set_Data(prevData => ({
                    ...prevData,  // Keep existing labels
                    datasets: [
                        {
                            ...prevData.datasets[0],
                            data: response.data.map((trstats)=>trstats['stock_num'])
                        }
                    ]
                }));
                console.log(data);
            }).catch((err)=>{
                console.error(err);
            });

            //set_Data({...data,labels: ['Max','Min']})
        }
        getStats();
    },[])

    return(
        <>
            <Navbar/>
            <div className="container">
                <h3 className="text-center">
                    <label style={{fontSize:"18px"}}>Transaction Stats
                    </label>
                </h3>
                <div className="row">
                    <div className="col-lg-3 col-md-3">
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <Pie data={data} options={options} />
                    </div>
                    <div className="col-lg-3 col-md-3">
                    </div>
                </div>
            </div>
        </>
    )
}