import Navbar from "../Navbar/Navbar"
import { useLocation } from "react-router-dom";
import { useState } from "react";
import {  ItemsContext } from '../Context/Item';
import Login from "../Modal/Login";
import Sell from "../Modal/Sell";


const Details = () => {
  const location = useLocation(); 
  const { item } = location.state || {}; 

  const [openModal, setModal] = useState(false);
  const [openModalSell, setModalSell] = useState(false);
  const itemsCtx= ItemsContext();

  const toggleModal = () => setModal(!openModal);
  const toggleModalSell = () => setModalSell(!openModalSell);

  return (
      <div>
          <Navbar toggleModalSell={toggleModalSell} toggleModal={toggleModal} />
          <Login toggleModal={toggleModal} status={openModal} />

          <div className="grid grid-cols-1 gap-0 p-10 px-5 sm:gap-5 sm:grid-cols-1 md:grid-cols-2 sm:px-15 md:px-30 lg:px-40">
              <div className="flex justify-center w-full overflow-hidden border-2 rounded-lg h-96">
               
                  <img className="object-cover" src={item?.imageUrl} alt={item?.title} />
              </div>
              <div className="relative flex flex-col w-full">
           
                  <p className="p-1 pl-0 text-2xl font-bold">₹ {item?.price}</p>
                  <p className="p-1 pl-0 text-base">{item?.category}</p>
                  <p className="p-1 pl-0 text-xl font-bold">{item?.title}</p>
                  <p className="w-full p-1 pl-0 overflow-hidden break-words sm:pb-0 text-ellipsis">
                      {item?.description}
                  </p>
                  <div className="relative bottom-0 flex justify-between w-full sm:relative md:absolute">
                      <p className="p-1 pl-0 font-bold">Seller: {item?.userName}</p>
                      <p className="p-1 pl-0 text-sm">{item?.createdAt}</p>
                  </div>
              </div>
          </div>

          <Sell setItems={(itemsCtx ).setItems} toggleModal={toggleModalSell} status={openModalSell} />
      </div>
  );
};

export default Details