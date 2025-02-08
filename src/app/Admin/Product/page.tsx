"use client";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";

import SideCard from "@/components/SideCard"; 

const AdminProductsPage = () => {
  interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    dicountPercentage: number;
    tags: string[];
    isNew: boolean;
    productImage: string;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterNewArrival, setFilterNewArrival] = useState<boolean>(false);
  const [filterDiscount, setFilterDiscount] = useState<boolean>(false);

  // Fetch products from Sanity
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `*[_type == "product"]{
          _id,
          title,
          description,
          price,
          dicountPercentage,
          tags,
          isNew,
          "productImage": productImage.asset->url
        }`;
        const data = await client.fetch(query);
        setProducts(data);
        setFilteredProducts(data); 
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); 
      }
    };
    fetchProducts();
  }, []);
  useEffect(() => {
    let updatedProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterNewArrival) {
      updatedProducts = updatedProducts.filter((product) => product.isNew);
    }

    if (filterDiscount) {
      updatedProducts = updatedProducts.filter((product) => product.dicountPercentage > 0);
    }

    setFilteredProducts(updatedProducts);
  }, [searchQuery, filterNewArrival, filterDiscount, products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full border-t-4 border-black w-16 h-16"></div>
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-gray-50">
      <SideCard />
      <div className="flex-1 p-6 overflow-y-auto ml-0 md:ml-1/4 lg:ml-1/5">
        <div className="mb-6 flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold text-gray-700 text-center">Product Management</h1>
        </div>
        <div className="mb-6 flex flex-wrap space-x-4 items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title..."
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none w-full sm:w-1/2 md:w-2/3 lg:w-1/3"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filterNewArrival}
              onChange={() => setFilterNewArrival(!filterNewArrival)}
              className="h-4 w-4"
            />
            <span>New Arrival</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filterDiscount}
              onChange={() => setFilterDiscount(!filterDiscount)}
              className="h-4 w-4"
            />
            <span>Discounted</span>
          </label>
        </div>
        <div className="overflow-x-auto bg-white shadow-sm rounded-lg p-4 border border-gray-200">
          <table className="min-w-full table-auto">
            <thead className="bg-yellow-300">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Image</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Discount</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tags</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">New Arrival</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className="px-4 py-2">
                    <img
                      src={product.productImage}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">{product.title}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">${product.price}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {product.dicountPercentage > 0 ? (
                      <span className="text-red-500">{product.dicountPercentage}% Off</span>
                    ) : (
                      "No Discount"
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {product.tags.join(", ")}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {product.isNew ? (
                      <span className="text-green-600">New</span>
                    ) : (
                      "Not New"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminProductsPage;
