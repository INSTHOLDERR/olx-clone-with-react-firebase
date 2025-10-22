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
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // New state to trigger re-fetch

  const itemsCtx = ItemsContext();

  const toggleModal = () => setModal(!openModal);
  const toggleModalSell = () => setModalSell(!openModalSell);

  // Fetch items from Firestore whenever refreshKey changes
  useEffect(() => {
    const getItems = async () => {
      const datas = await fetchFromFirestore();
      itemsCtx?.setItems(datas);
    };
    getItems();
  }, [refreshKey]); // <- added dependency

  // Trigger refresh from child components (e.g., after Sell or Delete)
  const refreshItems = () => setRefreshKey(prev => prev + 1);

  // Filter items by category, search, and location
  const filteredItems = itemsCtx.items?.filter(item => {
    const matchCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchSearch = searchQuery
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchLocation = locationQuery
      ? item.location?.toLowerCase().includes(locationQuery.toLowerCase())
      : true;
    return matchCategory && matchSearch && matchLocation;
  }) || [];

  // Handle card click
  const handleCardClick = (item) => setSelectedItem(item);

  // Back button
  const handleBack = () => setSelectedItem(null);

  return (
    <div>
      <Navbar
        toggleModal={toggleModal}
        toggleModalSell={toggleModalSell}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        locationQuery={locationQuery}
        setLocationQuery={setLocationQuery}
      />

      <Login toggleModal={toggleModal} status={openModal} />
      <Sell
        setItems={itemsCtx.setItems}
        toggleModalSell={toggleModalSell}
        status={openModalSell}
        onSuccess={refreshItems} // <- trigger refresh after adding a new item
      />

      {/* Show Details or Card list */}
      {!selectedItem ? (
        <Card items={filteredItems} title="Products" onCardClick={handleCardClick} />
      ) : (
        <Details item={selectedItem} onBack={handleBack} onDelete={refreshItems} /> // <- trigger refresh after deleting
      )}

      <Footer />
    </div>
  );
};

export default Home;
