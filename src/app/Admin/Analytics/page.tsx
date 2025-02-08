"use client";
 import { useEffect, useState } from "react";
  import { client } from "@/sanity/lib/client";
   import SideCard from "@/components/SideCard";
    import { Bar } from "react-chartjs-2"; 
    import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from "chart.js";

    // Register necessary chart components 
    ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend ); 
    export default function Analytics()
     { const [products, setProducts] = useState<any[]>([]); 
      const [orders, setOrders] = useState<any[]>([]); 
      const [newProducts, setNewProducts] = useState(0);
       const [productsPerMonth, setProductsPerMonth] = useState<number[]>([]); 
       const [ordersPerMonth, setOrdersPerMonth] = useState<number[]>([]); 
       const [loading, setLoading] = useState<boolean>(true); 
       useEffect(() => { const fetchData = async () => {
         try {
           const productsData = await client.fetch('*[_type == "product"]'); 
           setProducts(productsData); calculateNewProducts(productsData);
            processProductData(productsData); const ordersData = await client.fetch('*[_type == "order"]'); 
            setOrders(ordersData); processOrderData(ordersData);
           }
            catch (error) {
               console.error("Error fetching data:", error);
               }
                finally { setLoading(false); 

                } 
              }; fetchData();
             }, []);
              const calculateNewProducts = (products: any[]) => { const oneMonthAgo = new Date();
                 oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                 const newProductsCount = products.filter((product: any) => { const productDate = new Date(product._createdAt);
                   return productDate > oneMonthAgo;
                   }).length; setNewProducts(newProductsCount);
                   }; 
                   const processProductData = (products: any[]) => { 
                    const monthCounts: number[] = Array(12).fill(0);
                     products.forEach((product: any) => { const date = new Date(product._createdAt); 
                      const month = date.getMonth(); monthCounts[month] += 1; });
                       setProductsPerMonth(monthCounts);
                       };
                        const processOrderData = (orders: any[]) => { const monthCounts: number[] = Array(12).fill(0); 
                          orders.forEach((order: any) => { const date = new Date(order._createdAt);
                             const month = date.getMonth(); monthCounts[month] += 1; });
                              setOrdersPerMonth(monthCounts);
                             }; 
                             const chartData = { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                               datasets: [ { label: "Products Added",
                                 data: productsPerMonth, backgroundColor: "rgba(184, 142, 96, 0.6)", borderColor: "rgba(184, 142, 96, 1)", borderWidth: 1, }, 
                                 { label: "Orders Placed", data: ordersPerMonth, backgroundColor: "rgba(255, 159, 64, 0.6)", borderColor: "rgba(255, 159, 64, 1)", borderWidth: 1, }, ], }; if (loading)
                                   { 
                                    return (
                                       <div className="flex justify-center items-center h-screen"> 
                                       <div className="animate-spin rounded-full border-t-4 border-black w-16 h-16">
                                        </div>
                                         </div> 
                                         ); 
                                        } 
                                        return (
                                           <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
                                             <SideCard /> 
                                             <div className="flex-1 p-4">
                                               <div className="mb-6 text-center"> 
                                                <h1 className="text-2xl font-bold text-gray-700">Analytics</h1>
                                                 </div> <div className="bg-white shadow p-4 rounded-md mb-6"> 
                                                  <Bar data={chartData} options={{ responsive: true }} height={150} />
                                                   </div> 
                                                   </div> 
                                                   </div>

                                    );
                   }