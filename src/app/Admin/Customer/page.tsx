"use client";
import { client } from "@/sanity/lib/client"; 
import React, { useEffect, useState } from "react";
import SideCard from "@/components/SideCard";

interface OrderItem {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  orderDate: string;
  streetAddress: string;
  country: string; // Added country
}

const Customer = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const query = `*[_type == "order"]{
          _id, 
          firstName,
          lastName,
          email,
          phone,
          status,
          orderDate,
          streetAddress,
          country
        }`;

        const ordersData = await client.fetch(query);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      `${order.firstName} ${order.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-700">Customer Management</h1>
        </div>
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search by name or email"
            className="px-4 py-2 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 rounded-lg border border-gray-300 shadow-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-yellow-300 text-gray-700">
                <th className="px-6 py-4 border text-left">Full Name</th>
                <th className="px-6 py-4 border text-left">Phone Number</th>
                <th className="px-6 py-4 border text-left">Email</th>
                <th className="px-6 py-4 border text-left">Country</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-100 transition-all">
                  <td className="px-6 py-4 border whitespace-nowrap">{`${order.firstName} ${order.lastName}`}</td>
                  <td className="px-6 py-4 border whitespace-nowrap">{order.phone}</td>
                  <td className="px-6 py-4 border whitespace-nowrap">{order.email}</td>
                  <td className="px-6 py-4 border whitespace-nowrap">{order.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customer;
