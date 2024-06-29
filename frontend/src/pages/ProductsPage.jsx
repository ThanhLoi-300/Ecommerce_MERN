import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import { categoriesData } from "../static/data";
import PaginationButtons from "../components/Pagination/PaginationButton";

const ProductsPage = () => {
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [data, setData] = useState([]);
  const [totalList, setTotalList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [filter, setFilter] = useState({
    search: "",
    max: 0,
    min: 0,
    category: [],
    sort: "",
  });

  const handleOnChange = (event) => {
    setFilter({ ...filter, [event.target.name]: event.target.value });
  };

  const handleOnChangeCheckbox = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      // Nếu checkbox được chọn, thêm giá trị vào mảng checkedValues
      setFilter({ ...filter, category: [...filter.category, value] });
    } else {
      // Nếu checkbox được bỏ chọn, loại bỏ giá trị khỏi mảng checkedValues
      setFilter({
        ...filter,
        category: filter.category.filter((item) => item !== value),
      });
    }
  };

  useEffect(() => {
    if (allProducts) {
      let filteredProducts = allProducts;

      if (filter.search) {
        // Lọc theo từ khóa tìm kiếm
        filteredProducts = filteredProducts.filter((product) =>
          product.name.toLowerCase().includes(filter.search.toLowerCase())
        );
      }

      if (filter.category.length > 0) {
        // Lọc theo danh mục
        filteredProducts = filteredProducts.filter((product) =>
          filter.category.includes(product.category)
        );
      }

      if (filter.min > 0) {
        // Lọc theo giá tối thiểu
        filteredProducts = filteredProducts.filter(
          (product) => product.originalPrice >= parseInt(filter.min)
        );
      }

      if (filter.max > 0) {
        // Lọc theo giá tối thiểu
        filteredProducts = filteredProducts.filter(
          (product) => product.originalPrice <= parseInt(filter.max)
        );
      }

      let list = [...filteredProducts];

      if (filter.sort === "asc") {
        // Sắp xếp giá tăng dần
        list.sort((a, b) => a.originalPrice - b.originalPrice);
      } else if (filter.sort === "desc") {
        // Sắp xếp giá giảm dần
        list.sort((a, b) => b.originalPrice - a.originalPrice);
      }

      setTotalList(list);
      setData(
        list?.slice(
          (currentPage - 1) * productsPerPage,
          currentPage * productsPerPage
        )
      );
    }
  }, [filter, allProducts, currentPage]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={3} />
          <br />
          <div className="flex row">
            <div className="800px:ml-10 800px:w-[30%] 1100px:ml-14 1100px:w-[24%] bg-white rounded-3xl mb-12 375px:ml-2 375px:w-[45%]">
              <div className="p-4 border-b-2 border-gray-300">
                <h4 className="font-[500] text-[20px]">Search</h4>
                <input
                  type="text"
                  className="w-full h-[30px] border border-gray-300 rounded-[3px] pl-2"
                  placeholder="Search Product...."
                  name="search"
                  onChange={handleOnChange}
                />
              </div>
              <div className="p-4 border-b-2 border-gray-300">
                <h4 className="font-[500] text-[20px]">Categorise</h4>
                {categoriesData &&
                  categoriesData.map((i, index) => {
                    return (
                      <div className="p-2">
                        <input
                          type="checkbox"
                          name="category"
                          value={i.title}
                          onChange={handleOnChangeCheckbox}
                        />
                        <span className="pl-2 text-black">{i.title}</span>
                      </div>
                    );
                  })}
              </div>
              <div className="p-4 border-b-2 border-gray-300">
                <h4 className="font-[500] text-[20px]">Price</h4>
                <div className="p-2">
                  <input
                    type="number"
                    name="min"
                    className="border border-gray-300 px-2 w-full"
                    placeholder="Enter min price"
                    onChange={handleOnChange}
                  />
                  <div className="flex w-full justify-center items-center">
                    to
                  </div>
                  <input
                    type="number"
                    name="max"
                    className="border border-gray-300 px-2 w-full"
                    placeholder="Enter max price"
                    onChange={handleOnChange}
                  />
                </div>
              </div>
              <div className="p-4 border-b-2 border-gray-300">
                <h4 className="font-[500] text-[20px]">Sort By Price</h4>
                <div className="flex flex-col gap-4">
                  <select
                    name="sort"
                    className="border border-gray-300 rounded-xl px-2"
                    onChange={handleOnChange}
                  >
                    <option value="default">Default</option>
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={`375px:w-6/12 800px:w-10/12 1100px:w-11/12 mx-auto`}>
              <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] ml-4 mb-12">
                {data &&
                  data?.map((i, index) => <ProductCard data={i} key={index} />)}
              </div>
              {data && data.length === 0 && (
                <h1 className="text-center w-full pb-[100px] text-[20px]">
                  No products Found!
                </h1>
              )}
              {data && data?.length !== 0 && (
                <PaginationButtons
                  totalPages={Math.ceil(totalList?.length / productsPerPage)}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </div>
          </div>

          <Footer />
        </div>
      )}
    </>
  );
};

export default ProductsPage;
