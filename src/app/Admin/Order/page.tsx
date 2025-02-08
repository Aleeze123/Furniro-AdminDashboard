"use client";
import { client } from "@/sanity/lib/client"; 
import React, { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaSadTear } from "react-icons/fa"; 
import SideCard from "@/components/SideCard"; 

interface OrderItem {
  _id: string; 
  firstName: string;
  lastName: string;
  status: string;
  email: string;
  orderDate: string;
  streetAddress: string;
  country: string;
  orderAmount: number | null;
  cartItems: {
    product: { title: string; image: { asset: { url: string } } | null; price: number } | null;
    quantity: number;
  }[]; 
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All"); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const query = `*[_type == "order"]{
            _id, // Fetch Order ID
            firstName,
            lastName,
            status,
            email,
            orderDate,
            streetAddress,
            country, // Added country field
            orderAmount,
            cartItems[] {
                product-> { title, image, price }, // Fetch price and image
                quantity
            }
        }`;

        const ordersData = await client.fetch(query);
        setOrders(ordersData);
        setFilteredOrders(ordersData); // Set filtered orders 
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle search functionality
  const handleSearch = () => {
    const filtered = orders.filter(order =>
      order.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  // Handle filter by status
  const handleFilter = (status: string) => {
    setStatusFilter(status);
    if (status === "All") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => order.status === status);
      setFilteredOrders(filtered);
    }
  };
  const calculateTotalAmount = (cartItems: { product: { price: number } | null; quantity: number }[]) => {
    return cartItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
  };
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await client
        .patch(orderId) 
        .set({ status: newStatus }) 
        .commit(); 
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status in Sanity:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full border-t-4 border-black w-16 h-16"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Sidebar*/}
      <SideCard />

      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Orders</h1>

        {/* Search & Filter */}
        <div className="mb-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center border rounded-md bg-white p-2 w-full lg:w-auto">
            <FaSearch className="text-gray-500 mr-2" /> {/* Search icon */}
            <input
              type="text"
              className="px-4 py-2 w-full border-none focus:outline-none"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch();
              }}
            />
          </div>

          <div className="flex items-center border rounded-md bg-white p-2 w-full lg:w-auto">
            <FaFilter className="text-gray-500 mr-2" /> {/* Filter icon */}
            <select
              className="px-4 py-2 border-none focus:outline-none"
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
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-yellow-300 text-left text-sm">
                <th className="px-4 py-2 border">Customer</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Order Date</th>
                <th className="px-4 py-2 border">Street Address</th>
                <th className="px-4 py-2 border">Country</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Products</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-2 text-center text-gray-500">
                    <p><FaSadTear /> No orders found. Please try adjusting your search or filter.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-100">
                    <td className="px-4 py-2">{order.firstName} {order.lastName}</td>
                
                    <td className="px-4 py-2">{order.status}</td>
                    <td className="px-4 py-2">{order.email}</td>
                    <td className="px-4 py-2">{new Date(order.orderDate).toLocaleString()}</td>
                    <td className="px-4 py-2">{order.streetAddress}</td>
                    <td className="px-4 py-2">{order.country}</td> {/* Displaying country */}
                    <td className="px-4 py-2">
                      ${calculateTotalAmount(order.cartItems).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      {order.cartItems.length > 0 ? (
                        order.cartItems.map((item, idx) => (
                          <div key={idx} className="flex items-center mb-2">
                            <div>
                              <strong>{item.product ? item.product.title : "Product not found"}</strong> x{item.quantity}
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
      </div>
    </div>
  );
};
export default OrdersPage;
