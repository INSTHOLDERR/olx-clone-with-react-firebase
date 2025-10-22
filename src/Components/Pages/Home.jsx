import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Login from '../Modal/Login';
import Sell from '../Modal/Sell';
import Card from '../Card/Card';
import Details from '../Details/Details';
import { ItemsContext } from '../Context/Item';
import { fetchFromFirestore } from '../Firebase/Firebase';
import Footer from './Footer';

const Home = () => {
  const [openModal, setModal] = useState(false);
  const [openModalSell, setModalSell] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDropdown, setSelectedDropdown] = useState('');

  const itemsCtx = ItemsContext();

  const toggleModal = () => setModal(!openModal);
  const toggleModalSell = () => setModalSell(!openModalSell);

  // Fetch items from Firestore
  useEffect(() => {
    const getItems = async () => {
      const datas = await fetchFromFirestore();
      itemsCtx?.setItems(datas);
    };
    getItems();
  }, []);

  // Filter items by category
  const filteredItems = selectedCategory
    ? itemsCtx.items.filter(item => item.category === selectedCategory)
    : itemsCtx.items;

  // Handle card click
  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  // Back button
  const handleBack = () => setSelectedItem(null);

  return (
    <div>
      <Navbar
        toggleModal={toggleModal}
        toggleModalSell={toggleModalSell}
        setSelectedCategory={setSelectedCategory}
        selectedDropdown={selectedDropdown}
        setSelectedDropdown={setSelectedDropdown}
      />

      <Login toggleModal={toggleModal} status={openModal} />
      <Sell setItems={itemsCtx.setItems} toggleModalSell={toggleModalSell} status={openModalSell} />

      {/* Show Details or Card list */}
      {!selectedDropdown && (
        selectedItem ? (
          <Details item={selectedItem} onBack={handleBack} />
        ) : (
          <Card items={filteredItems || []} title="Products" onCardClick={handleCardClick} />
        )
      )}

      <Footer />
    </div>
  );
};

export default Home;
