import axios from "axios";
import React, { useEffect, useState } from "react";

const ProductComponent = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState("");

  const PRODUCTS_PER_PAGE = 6;

  const getAllProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://fakestoreapi.com/products");
      setAllProducts(res.data);
      setProducts(res.data.slice(0, PRODUCTS_PER_PAGE));
      const uniqueCategories = [
        "all",
        ...new Set(res.data.map((p) => p.category)),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const filterAndSortProducts = (items) => {
    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) &&
        (category === "all" || item.category === category)
    );
    let sorted = [...filtered];
    if (sort === "price-low")
      sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (sort === "price-high")
      sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    else if (sort === "rating-high")
      sorted.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));
    return sorted;
  };

  useEffect(() => {
    const filteredSorted = filterAndSortProducts(allProducts);
    setProducts(filteredSorted.slice(0, PRODUCTS_PER_PAGE));
    setPage(1);
  }, [search, category, allProducts, sort]);

  const loadMore = () => {
    const filteredSorted = filterAndSortProducts(allProducts);
    if (products.length >= filteredSorted.length) return;
    setLoading(true);
    setTimeout(() => {
      const nextProducts = filteredSorted.slice(
        products.length,
        products.length + PRODUCTS_PER_PAGE
      );
      setProducts((prev) => [...prev, ...nextProducts]);
      setLoading(false);
      setPage((p) => p + 1);
    }, 600);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight &&
        !loading
      ) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, products, search, category, sort, allProducts]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Heading */}
      <h1
        className="text-6xl font-bold my-10 text-center"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        Explore Products
      </h1>

      {/* Search + Category + Sort */}
      <div className="mx-auto w-[90%] flex flex-col sm:flex-row gap-4 mb-10">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg p-3 focus:outline-none focus:ring focus:border-blue-400 bg-transparent"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-60 border rounded-lg p-3 focus:outline-none focus:ring focus:border-blue-400 bg-transparent"
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-60 border rounded-lg p-3 focus:outline-none focus:ring focus:border-blue-400 bg-transparent"
        >
          <option value="">Sort By</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
          <option value="rating-high">Rating: High → Low</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {products.map((item, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-200 flex flex-col justify-between h-full bg-transparent"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-contain mb-4"
            />
            <h2 className="font-semibold text-base mb-2">{item.title}</h2>
            <p className="text-lg font-bold mb-2">Price: ${item.price}</p>
            <p className="text-sm opacity-70 mb-2">
              ⭐ {item.rating?.rate ?? "N/A"} / 5
            </p>
            <div className="flex justify-center">
              <button className="w-[70%] border border-black dark:border-white text-black dark:text-white py-2 rounded-lg font-semibold tracking-wide hover:bg-black hover:text-white transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}

        {/* Skeleton Loading Cards */}
        {loading &&
          [...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 shadow h-80 bg-gray-200 dark:bg-gray-700 animate-pulse"
            >
              <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 mb-4"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 mb-2"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 w-1/2"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-600 w-3/4 mx-auto mt-4 rounded-lg"></div>
            </div>
          ))}
      </div>

      {/* Bottom Spinner */}
      {loading && (
        <div className="flex justify-center mt-6">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      )}

      {products.length >= filterAndSortProducts(allProducts).length &&
        !loading && <p className="text-center mt-4">No more products!</p>}
    </div>
  );
};

export default ProductComponent;
