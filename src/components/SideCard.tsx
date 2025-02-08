"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTachometerAlt, FaBox, FaUsers, FaShoppingCart, FaChartLine, FaFileAlt, FaBars, FaUserAlt } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const router = useRouter();


  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); 
  };

  return (
    <div>
      {/* Sidebar - */}
      <div
        className={`w-64 bg-black text-white p-6 fixed top-0 left-0 h-full z-50 lg:block lg:static transition-all duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-start mb-10">
          <Image
            src="/Logo.png"
            alt="Furniro Logo"
            height={48}
            width={48}
            className="h-12 w-12"
          />
          <div className="text-3xl font-bold text-yellow-400 ml-2">
            Furniro
          </div>
        </div>
        <ul className="space-y-6">
 
          <li>
            <Link href="/Admin/Dashboard" legacyBehavior>
              <a className="flex items-center py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                <FaTachometerAlt size={20} />
                <span className="ml-3">Dashboard</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/Admin/Product" legacyBehavior>
              <a className="flex items-center py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                <FaBox size={20} />
                <span className="ml-3">Products</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/Admin/Customer" legacyBehavior>
              <a className="flex items-center py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                <FaUsers size={20} />
                <span className="ml-3">Customers</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/Admin/Order" legacyBehavior>
              <a className="flex items-center py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                <FaShoppingCart size={20} />
                <span className="ml-3">Orders</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/Admin/Sales" legacyBehavior>
              <a className="flex items-center py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                <FaChartLine size={20} />
                <span className="ml-3">Sales</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/Admin/Analytics" legacyBehavior>
              <a className="flex items-center py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                <FaChartLine size={20} />
                <span className="ml-3">Analytics</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/Admin/Reports" legacyBehavior>
              <a className="flex items-center py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                <FaFileAlt size={20} />
                <span className="ml-3">Reports</span>
              </a>
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 w-full text-left"
            >
              <FaUserAlt size={20} />
              <span className="ml-3">Logout</span>
            </button>
          </li>
        </ul>
      </div>


      <button
        className="lg:hidden fixed top-4 left-4 p-3 bg-black text-white rounded-full z-50"
        onClick={toggleSidebar}
      >
        <FaBars className="text-xl" />
      </button>
    </div>
  );
};

export default Sidebar;
