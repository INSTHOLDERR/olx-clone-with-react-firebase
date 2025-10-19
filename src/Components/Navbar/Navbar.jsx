import './Navbar.css';
import logo from '../../assets/symbol.png';
import search from '../../assets/search1.svg';
import arrow from '../../assets/arrow-down.svg';
import searchWt from '../../assets/search.svg';
import addBtn from '../../assets/addButton.png';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/Firebase';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import { createPortal } from 'react-dom';

const Navbar = ({ toggleModal, toggleModalSell, setSelectedCategory }) => {
  const [user] = useAuthState(auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setDropdownOpen(false);
  };

  const categories = [
    { name: 'All categories', value: '' },
    { name: 'Cars', value: 'Cars' },
    { name: 'Motorcycles', value: 'Motorcycles' },
    { name: 'Mobile Phones', value: 'Mobile Phones' },
    { name: 'For sale: Houses & Apartments', value: 'Houses & Apartments' },
    { name: 'Scooter', value: 'Scooter' },
    { name: 'Commercial & Other Vehicles', value: 'Commercial & Other Vehicles' },
    { name: 'For rent: Houses & Apartments', value: 'Houses & Apartments' },
  ];

  return (
    <div>
      {/* Navbar */}
      <nav className="fixed z-50 flex items-center w-full p-2 pl-3 pr-3 overflow-auto border-b-4 border-solid shadow-md bg-slate-100 border-b-white">
        {/* Logo */}
        <img src={logo} alt="" className="w-12" />

        {/* Location Search */}
        <div className="relative ml-5 location-search">
          <img src={search} alt="" className="absolute w-5 top-4 left-2" />
          <input
            placeholder="Search city, area, or locality..."
            className="w-[50px] sm:w-[150px] md:w-[250px] lg:w-[270px] p-3 pl-8 pr-8 border-black border-2 rounded-md placeholder:text-ellipsis focus:outline-none focus:border-teal-300"
            type="text"
          />
          <img src={arrow} alt="" className="absolute w-5 cursor-pointer top-4 right-3" />
        </div>

        {/* Main Search */}
        <div className="relative w-full ml-5 mr-2 main-search">
          <input
            placeholder="Find Cars, Mobile Phones, and More..."
            className="w-full p-3 border-2 border-black rounded-md placeholder:text-ellipsis focus:outline-none focus:border-teal-300"
            type="text"
          />
          <div
            style={{ backgroundColor: '#002f34' }}
            className="absolute top-0 right-0 flex items-center justify-center w-12 h-full rounded-e-md"
          >
            <img className="w-5 filter invert" src={searchWt} alt="Search Icon" />
          </div>
        </div>

        {/* Language */}
        <div className="relative mx-1 sm:ml-5 sm:mr-5 lang">
          <p className="mr-3 font-bold">English</p>
          <img src={arrow} alt="" className="w-5 cursor-pointer" />
        </div>

        {/* User/Profile */}
        {!user ? (
          <p
            className="ml-5 font-bold underline cursor-pointer"
            style={{ color: '#002f34' }}
            onClick={toggleModal}
          >
            Login
          </p>
        ) : (
          <div className="relative ml-5">
            <img
              src={user.photoURL || 'https://via.placeholder.com/40'}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {dropdownOpen &&
              createPortal(
                <ul className="dropdown">
                  <li>My Ads</li>
                  <li>My Wishlist</li>
                  <li onClick={handleLogout}>Logout</li>
                </ul>,
                document.body
              )}
          </div>
        )}

        {/* Sell Button */}
        <img
          src={addBtn}
          onClick={user ? toggleModalSell : toggleModal}
          className="w-24 mx-1 rounded-full shadow-xl cursor-pointer sm:ml-5 sm:mr-5"
          alt=""
        />
      </nav>

      {/* Sub-lists / Categories */}
      <div className="relative z-0 flex w-full p-2 pt-20 pl-10 pr-10 overflow-auto shadow-md sm:pl-44 md:pr-44 sub-lists">
        <ul className="flex items-center justify-start w-full gap-4 list-none">
          {categories.map((cat, index) => (
            <li
              key={index}
              className="font-semibold cursor-pointer hover:text-teal-500"
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
