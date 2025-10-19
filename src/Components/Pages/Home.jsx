import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Login from '../Modal/Login';
import Sell from '../Modal/Sell';
import Card from '../Card/Card';
import { ItemsContext } from '../Context/Item';
import { fetchFromFirestore } from '../Firebase/Firebase';

const Home = () => {
  const [openModal, setModal] = useState(false);
  const [openModalSell, setModalSell] = useState(false);

  const toggleModal = () => setModal(!openModal);
  const toggleModalSell = () => setModalSell(!openModalSell);

  const itemsCtx = ItemsContext(); // Context value

  const [selectedCategory, setSelectedCategory] = useState(''); // New state for category filter

  // Fetch items from Firestore
  useEffect(() => {
    const getItems = async () => {
      const datas = await fetchFromFirestore();
      itemsCtx?.setItems(datas);
    };
    getItems();
  }, []);

  // Log items updates (optional)
  useEffect(() => {
    console.log('Updated Items:', itemsCtx.items);
  }, [itemsCtx.items]);

  // Filter items based on selected category
  const filteredItems = selectedCategory
    ? itemsCtx.items.filter(item => item.category === selectedCategory)
    : itemsCtx.items;

  return (
    <div>
      <Navbar
        toggleModal={toggleModal}
        toggleModalSell={toggleModalSell}
        setSelectedCategory={setSelectedCategory} // Pass category setter
      />
      <Login toggleModal={toggleModal} status={openModal} />
      <Sell setItems={itemsCtx.setItems} toggleModalSell={toggleModalSell} status={openModalSell} />

      <Card items={filteredItems || []} />
    </div>
  );
};

export default Home;
