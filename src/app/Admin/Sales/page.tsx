"use client";
import { client } from "@/sanity/lib/client"; // Import Sanity client
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaFilter, FaSadTear } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import SideCard from "@/components/SideCard"; // Sidebar Component
// Import necessary components from chart.js
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

// Register the components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define the types of data you're expecting to receive
interface SalesData {
  _id: string;
  firstName: string;
  lastName: string;
  orderDate: string;
  orderAmount: number | null;
  status: string;
  cartItems: {
    product: { title: string; price: number; image: { asset: { url: string } } | null } | null;
    quantity: number;
  }[]; 
}

const SalesPage = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [salesByStatus, setSalesByStatus] = useState<any>([]);
  const [filteredSales, setFilteredSales] = useState<SalesData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch sales data
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const query = `*[_type == "order"]{
          _id,
          firstName,
          lastName,
          orderDate,
          orderAmount,
          status,
          cartItems[] {
            product-> { title, price, image },
            quantity
          }
        }`;

        const sales = await client.fetch(query);
        setSalesData(sales);
        setFilteredSales(sales);

        // Calculate total sales amount
        const total = sales.reduce(
          (acc: number, order: SalesData) => acc + (order.orderAmount || 0),
          0
        );
        setTotalSales(total);

        // Group sales by status
        const statusData = sales.reduce((acc: any, order: SalesData) => {
          const status = order.status || "Pending";
          acc[status] = (acc[status] || 0) + (order.orderAmount || 0);
          return acc;
        }, {});
        setSalesByStatus(statusData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  // Handle date filter
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    const filtered = salesData.filter(
      (order) =>
        new Date(order.orderDate).toLocaleDateString() ===
        new Date(e.target.value).toLocaleDateString()
    );
    setFilteredSales(filtered);
  };

  // Handle status filter
  const handleFilter = (status: string) => {
    setStatusFilter(status);
    if (status === "All") {
      setFilteredSales(salesData);
    } else {
      const filtered = salesData.filter((order) => order.status === status);
      setFilteredSales(filtered);
    }
  };

  // Prepare chart data
  const chartData = {
    labels: filteredSales.map((order) =>
      new Date(order.orderDate).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Sales Amount",
        data: filteredSales.map((order) => order.orderAmount || 0),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        fill: false,
      },
    ],
  };

  // Function to calculate total order amount based on products' quantity and price
  const calculateTotalAmount = (cartItems: { product: { price: number } | null; quantity: number }[]) => {
    return cartItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
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
      {/* Sidebar (SideCard) */}
      <SideCard />
    
      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Sales Overview</h1>

        {/* Filter and Date Picker */}
        <div className="mb-4 flex flex-col lg:flex-row gap-4">
          <div className="flex items-center border rounded-md bg-white p-2 w-full lg:w-auto">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="px-4 py-2 border-none focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center border rounded-md bg-white p-2 w-full lg:w-auto">
            <FaFilter className="text-gray-500 mr-2" />
            <select
              className="px-4 py-2 border-none focus:outline-none w-full"
              value={statusFilter}
              onChange={(e) => handleFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="success">Success</option>
              <option value="dispatch">Dispatch</option>
            </select>
          </div>
        </div>

        {/* Sales Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-yellow-300 text-left text-sm">
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">Customer</th>
                <th className="px-4 py-2 border">Order Date</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Products</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-2 text-center text-gray-500">
                    <FaSadTear /> No sales data found for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredSales.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-100">
                    <td className="px-4 py-2 border">{order._id}</td>
                    <td className="px-4 py-2">{order.firstName} {order.lastName}</td>
                    <td className="px-4 py-2">
                      {new Date(order.orderDate).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{order.status}</td>
                    <td className="px-4 py-2">
                      {order.cartItems.length > 0 ? (
                        order.cartItems.map((item, idx) => (
                          <div key={idx} className="flex items-center mb-2">
                            <div>
                              <strong>{item.product ? item.product.title : "Product not found"}</strong> x{item.quantity} - ${item.product?.price}
                            </div>
                          </div>
                        ))
                      ) : (
                        <span>No products in this order</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Sales Chart */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-center">Sales Trends</h2>
          <Line data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
