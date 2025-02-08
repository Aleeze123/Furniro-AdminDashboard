"use client";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import SideCard from "@/components/SideCard";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]); 
  const [newProducts, setNewProducts] = useState(0); 
  const [productsPerMonth, setProductsPerMonth] = useState<number[]>([]); 
  const [ordersPerMonth, setOrdersPerMonth] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    // Fetching products and orders
    const fetchData = async () => {
      try {
        const productsData = await client.fetch('*[_type == "product"]');
        console.log("Fetched Products:", productsData);
        setProducts(productsData);
        calculateNewProducts(productsData);
        processProductData(productsData);

        const ordersData = await client.fetch('*[_type == "order"]');
        console.log("Fetched Orders:", ordersData);
        setOrders(ordersData);
        processOrderData(ordersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);
  const calculateNewProducts = (products: any[]) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const newProductsCount = products.filter((product: any) => {
      const productDate = new Date(product._createdAt);
      return productDate > oneMonthAgo;
    }).length;

    setNewProducts(newProductsCount);
  };

  // Process monthly data for products
  const processProductData = (products: any[]) => {
    const monthCounts: number[] = Array(12).fill(0);
    products.forEach((product: any) => {
      const date = new Date(product._createdAt);
      const month = date.getMonth();
      monthCounts[month] += 1;
    });
    setProductsPerMonth(monthCounts);
  };

  // Process monthly data for orders
  const processOrderData = (orders: any[]) => {
    const monthCounts: number[] = Array(12).fill(0);
    orders.forEach((order: any) => {
      const date = new Date(order._createdAt);
      const month = date.getMonth();
      monthCounts[month] += 1;
    });
    setOrdersPerMonth(monthCounts);
  };

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Products Added",
        data: productsPerMonth,
        fill: false,
        borderColor: "rgba(184, 142, 96, 1)",
        tension: 0.1,
      },
      {
        label: "Orders Placed",
        data: ordersPerMonth,
        fill: false,
        borderColor: "rgba(255, 159, 64, 1)",
        tension: 0.1,
      },
    ],
  };
  if (loading) {
    return (
      
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full border-t-4 border-black w-16 h-16"></div>
      </div>
    );
  }

  return (
  
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <SideCard />
      <div className="flex-1 p-4">
        <div className="mb-6 flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold text-gray-700 text-center">
            بسم الله الرحمن الرحيم
          </h1>
          <p className="text-sm text-gray-600 mt-2 text-center">
            In the name of Allah, the Most Gracious, the Most Merciful.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow-sm rounded-lg p-3 flex flex-col items-center space-y-2 border border-gray-200">
            <div className="text-xl text-yellow-600">{products.length}</div>
            <div className="text-xs text-gray-600">Total Products</div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-3 flex flex-col items-center space-y-2 border border-gray-200">
            <div className="text-xl text-yellow-600">{orders.length}</div>
            <div className="text-xs text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-3 flex flex-col items-center space-y-2 border border-gray-200">
            <div className="text-xl text-green-600">{newProducts}</div>
            <div className="text-xs text-gray-600">New Products (Last Month)</div>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-3 mb-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Products vs Orders</h2>
          <Line
            data={chartData}
            options={{ responsive: true, maintainAspectRatio: true }}
            height={120}
          />
        </div>
      </div>
    </div>
 
  );
}
