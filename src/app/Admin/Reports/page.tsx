"use client";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import SideCard from "@/components/SideCard";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Order {
  _createdAt: string;
  status: string;
  totalPrice: number;
}

interface Product {
  _createdAt: string;
}

export default function Reports() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newOrders, setNewOrders] = useState(0);
  const [orderStatus, setOrderStatus] = useState<{ [key: string]: number }>({});
  const [monthlySales, setMonthlySales] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData: Order[] = await client.fetch('*[_type == "order"]');
        setOrders(ordersData);
        setNewOrders(ordersData.filter(order => order.status === "New").length);
        processOrderStatus(ordersData);
        processMonthlySales(ordersData);

        const productsData: Product[] = await client.fetch('*[_type == "product"]');
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processOrderStatus = (orders: Order[]) => {
    const statusCount: { [key: string]: number } = {};

    orders.forEach((order) => {
      if (!statusCount[order.status]) {
        statusCount[order.status] = 0;
      }
      statusCount[order.status] += 1;
    });

    setOrderStatus(statusCount);
  };

  const processMonthlySales = (orders: Order[]) => {
    const monthlySalesData: number[] = Array(12).fill(0);
    orders.forEach((order) => {
      const month = new Date(order._createdAt).getMonth();
      monthlySalesData[month] += order.totalPrice;
    });

    setMonthlySales(monthlySalesData);
  };

  const orderStatusChartData = {
    labels: Object.keys(orderStatus),
    datasets: [
      {
        label: "Order Status",
        data: Object.values(orderStatus),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const monthlySalesChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Monthly Sales",
        data: monthlySales,
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar (SideCard) */}
      <div className="w-full hidden sm:block md:w-1/4 lg:w-1/5 bg-black text-white p-6 min-h-screen flex-shrink-0">
        <SideCard />
      </div>
      <div className="sm:hidden">
        <SideCard />
      </div>

      <div className="flex-1 p-4 h-full overflow-y-auto">
        {/* Reports Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-700">Reports</h1>
        </div>

        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow p-4 rounded-md text-center">
            <h3 className="text-xl text-yellow-600">{products.length}</h3>
            <p className="text-sm">Total Products</p>
          </div>

          <div className="bg-white shadow p-4 rounded-md text-center">
            <h3 className="text-xl text-blue-600">{orders.length}</h3>
            <p className="text-sm">Total Orders</p>
          </div>

          <div className="bg-white shadow p-4 rounded-md text-center">
            <h3 className="text-xl text-green-600">{newOrders}</h3>
            <p className="text-sm">New Orders</p>
          </div>
        </div>

        {/* Order Status Bar Chart */}
        <div className="bg-white shadow p-4 rounded-md mb-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-700">Order Status Overview</h2>
          <Bar data={orderStatusChartData} options={{ responsive: true }} height={100} />
        </div>

        {/* Monthly Sales Line Chart */}
        <div className="bg-white shadow p-4 rounded-md mb-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-700">Monthly Sales Trend</h2>
          <Line data={monthlySalesChartData} options={{ responsive: true }} height={100} />
        </div>
      </div>
    </div>
  );
}
