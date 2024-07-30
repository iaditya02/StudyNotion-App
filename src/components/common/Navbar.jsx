import React, { useEffect, useState } from "react";
import { Link, matchPath } from "react-router-dom";
import logo from "../../assets/logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsCart3 } from "react-icons/bs";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { MdKeyboardArrowDown } from "react-icons/md";
import { AiOutlineMenu } from "react-icons/ai";
import { useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

// const subLinks=[
//   {
//     title:"python",
//     link:"/catalog/python"
//   },
//   {
//     title:"Web Dev",
//     link:"/catalog/webdev"
//   },
// ]

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const location = useLocation();

  //api call
  const [subLinks, setSubLinks] = useState([]);

  const fetchSubLinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      if (result?.data?.allCategory?.length > 0) {
        setSubLinks(result?.data?.allCategory);
      }
      localStorage.setItem("sublinks", JSON.stringify(result.data.data));
      console.log("Printing sublinks result", result);
      setSubLinks(result.data.allCategory);
    } catch (err) {
      console.log("couldnot fetch category list");
    }
  };

  const show = useRef();
  const overlay = useRef();

  const shownav = () => {
    show.current.classList.toggle("navshow");
    overlay.current.classList.toggle("hidden");
  };

  useEffect(() => {
    fetchSubLinks();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname); //checking if the current route matches with any of the routes in navbar links
  };

  return (
    <div className="flex sm:relative bg-richblack-900 w-screen relative z-50 h-14 items-center justify-center border-b-[1px] border-b-richblack-700 translate-y-  transition-all duration-500`">
      <div className=" flex w-11/12 max-w-maxContent items-center justify-between">
        <Link to="/">
          <img src={logo} width={160} height={42} loading="lazy"></img>
        </Link>

        {/* mobile Navbar */}
        {user && user?.accountType !== "Instructor" && (
          <div className=" md:hidden">
            <Link to="/dashboard/cart" className=" relative left-10">
              <div className="">
                <BsCart3 className=" fill-richblack-25 w-8 h-8" />
              </div>
              {totalItems > 0 && (
                <span className=" font-medium text-[12px] shadow-[3px ] shadow-black bg-yellow-100 text-richblack-900 rounded-full px-[4px] absolute -top-[2px] right-[1px]">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        )}

        <div
          className={`flex md:hidden  relative gap- flex-row ${
            token !== null && user?.accountType !== "Instructor"
              ? " -left-12"
              : ""
          }`}
        >
          <GiHamburgerMenu
            className={`w-16 h-8 fill-richblack-25 absolute left-10 -bottom-4 `}
            onClick={shownav}
          />
          <div
            ref={overlay}
            className=" fixed top-0 bottom-0 left-0 right-0 z-30 bg w-[100vw] hidden h-[100vh] overflow-y-hidden bg-[rgba(0,0,0,0.5)] "
            onClick={shownav}
          ></div>
          <div ref={show} className="mobNav z-50">
            <nav
              className=" items-center flex flex-col absolute w-[200px] -left-[80px] -top-7  glass2"
              ref={show}
            >
              {token == null && (
                <Link to="/login" className="">
                  <button
                    onClick={shownav}
                    className=" mt-4 text-center text-[15px] px-6 py-2 rounded-md font-semibold bg-yellow-50 text-black hover:scale-95 transition-all duration-200"
                  >
                    Login
                  </button>
                </Link>
              )}
              {token == null && (
                <Link to="/signup" className="text-yellow-50">
                  <button
                    onClick={shownav}
                    className="mt-4 text-center text-[15px] px-5 py-2 rounded-md font-semibold bg-yellow-50 text-black hover:scale-95 transition-all duration-200"
                  >
                    Signup
                  </button>
                </Link>
              )}

              {token != null && (
                <div className=" mt-2">
                  <p className=" text-richblack-50 text-center mb-2">Account</p>

                  <ProfileDropDown />
                </div>
              )}
              <div className=" mt-4 mb-4 bg-richblack-25 w-[200px] h-[2px]"></div>
              <p className=" text-xl text-yellow-50 font-semibold">Courses</p>
              <div className=" flex flex-col items-end pr-4">
                {subLinks?.length < 0 ? (
                  <div></div>
                ) : (
                  subLinks?.map((subLink, index) => (
                    <Link
                      to={`/catalog/${subLink.name
                        .split(" ")
                        .join("-")
                        .toLowerCase()}`}
                      key={index}
                      onClick={() => {
                        shownav();
                      }}
                      className="p-2 text-sm"
                    >
                      <p className=" text-richblack-5 ">{subLink.name}</p>
                    </Link>
                  ))
                )}
              </div>
              <div className=" mt-4 mb-4 bg-richblack-25 w-[200px] h-[2px]"></div>
              <Link
                to="/about"
                onClick={() => {
                  shownav();
                }}
                className="p-2"
              >
                <p className=" text-richblack-5 ">About</p>
              </Link>
              <Link
                to="/contact"
                onClick={() => {
                  shownav();
                }}
                className="p-2"
              >
                <p className=" text-richblack-5 ">Contact</p>
              </Link>
            </nav>
          </div>
        </div>

        <nav>
          <ul className=" md:flex gap-x-6 text-richblack-25 hidden font-medium">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div
                    className={`group relative flex cursor-pointer items-center gap-1 ${
                      matchRoute("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    <p>{link.title}</p>
                    <MdKeyboardArrowDown className=" font-medium text-xl" />

                    <div className=" invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                      <div className=" absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                      {subLinks?.length > 0 ? (
                        subLinks.map((subLink, index) => (
                          <Link
                            to={`/catalog/${subLink.name
                              .split(" ")
                              .join("-")
                              .toLowerCase()}`}
                            key={index}
                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                          >
                            <p className=" font-semibold">{subLink.name}</p>
                          </Link>
                        ))
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* login/signup/dashboard */}
        <div className="hidden md:flex gap-x-4 items-center">
          {user && user?.accountType != "Instructor" && (
            <Link to="/dashboard/cart" className=" relative">
              <BsCart3 className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}

          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign in
              </button>
            </Link>
          )}

          {token !== null && <ProfileDropDown />}
        </div>
        {/* <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button> */}
      </div>
    </div>
  );
};

export default Navbar;
