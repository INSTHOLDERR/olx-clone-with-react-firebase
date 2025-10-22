import React, { useEffect, useState } from "react";
import { ItemsContext } from "../Context/Item";
import { auth, fireStore, storage } from "../Firebase/Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, ModalBody } from "flowbite-react";
import { FaLocationArrow, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Card from "../Card/Card";

const Details = ({ item: initialItem, onBack }) => {
  const itemsCtx = ItemsContext();
  const [item, setItem] = useState(initialItem);
  const [user, setUser] = useState(auth.currentUser || null);
  const [isOwner, setIsOwner] = useState(false);
  const [recommended, setRecommended] = useState([]);
  const [wishlistAdded, setWishlistAdded] = useState(false);

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    imageFile: null,
  });
  const [locationInput, setLocationInput] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isPriceValid, setIsPriceValid] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // Fetch single item
  const fetchItem = async (itemId) => {
    try {
      const docRef = doc(fireStore, "products", itemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setItem({ id: docSnap.id, ...docSnap.data() });
    } catch (err) {
      console.error("Error fetching item:", err);
    }
  };

  // Ownership
  useEffect(() => {
    setIsOwner(user && user.uid === item?.userId);
  }, [user, item]);

  // Recommended items
  useEffect(() => {
    const fetchRecommended = async () => {
      if (!item?.category) return;
      const q = query(
        collection(fireStore, "products"),
        where("category", "==", item.category)
      );
      const snapshot = await getDocs(q);
      const filtered = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((prod) => prod.id !== item.id);
      setRecommended(filtered);
    };
    fetchRecommended();
  }, [item]);

  // Wishlist check
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user || !item) return;
      const q = query(collection(fireStore, "wishlist"), where("itemId", "==", item.id));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data();
        setWishlistAdded(docData.userIds?.includes(user.uid) || false);
      } else setWishlistAdded(false);
    };
    checkWishlist();
  }, [user, item]);

  // Remove Ad
  const handleRemoveAd = async () => {
    if (!isOwner) return;
    try {
      await deleteDoc(doc(fireStore, "products", item.id));
      toast.success("Ad removed successfully!");
      onBack(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove ad.");
    }
  };

  // Wishlist toggle
  const handleWishlistToggle = async () => {
    if (!user || !item) return;
    const wishlistRef = collection(fireStore, "wishlist");
    try {
      const q = query(wishlistRef, where("itemId", "==", item.id));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        await addDoc(wishlistRef, {
          itemId: item.id,
          originalUserId: item.userId,
          userIds: [user.uid],
          title: item.title,
          imageUrl: item.imageUrl,
          price: item.price,
          category: item.category,
          addedAt: new Date(),
        });
        setWishlistAdded(true);
        toast.success("Added to Wishlist!");
      } else {
        const docRef = snapshot.docs[0].ref;
        const docData = snapshot.docs[0].data();
        let updatedUserIds = docData.userIds || [];
        if (!updatedUserIds.includes(user.uid)) {
          updatedUserIds.push(user.uid);
          await updateDoc(docRef, { userIds: updatedUserIds });
          setWishlistAdded(true);
          toast.success("Added to Wishlist!");
        } else {
          updatedUserIds = updatedUserIds.filter((id) => id !== user.uid);
          await updateDoc(docRef, { userIds: updatedUserIds });
          setWishlistAdded(false);
          toast.info("Removed from Wishlist");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update wishlist");
    }
  };

  // Edit modal toggle
  const toggleEditModal = () => {
    if (!editModal && item) {
      setEditData({
        title: item.title || "",
        description: item.description || "",
        category: item.category || "",
        price: item.price?.toString() || "",
        imageFile: null,
      });
      setLocationInput(item.location || "");
      setImagePreview(item.imageUrl || null);
      setIsPriceValid(/^\d*$/.test(item.price?.toString() || ""));
    }
    setEditModal(!editModal);
  };

  // Edit submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d+$/.test(editData.price.trim())) {
      toast.error("Price must be a number");
      return;
    }
    setSubmitting(true);
    try {
      let imageUrl = imagePreview;
      if (editData.imageFile) {
        const imageRef = ref(storage, `products/${editData.imageFile.name}`);
        await uploadBytes(imageRef, editData.imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }
      const updatedData = { ...editData, imageUrl, location: locationInput };
      await updateDoc(doc(fireStore, "products", item.id), updatedData);
      await fetchItem(item.id);
      toast.success("Ad updated successfully!");
      toggleEditModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update ad");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setEditData({ ...editData, price: value });
    setIsPriceValid(/^\d*$/.test(value));
  };

  // Geolocation
  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationInput(`${latitude}, ${longitude}`);
        setLoadingLocation(false);
      },
      () => setLoadingLocation(false)
    );
  };

  // Location suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (locationInput.length < 3) return setSuggestions([]);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${locationInput}&addressdetails=1&limit=5`
        );
        setSuggestions(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    const delay = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(delay);
  }, [locationInput]);

  const handleSelectSuggestion = (s) => {
    setLocationInput(s.display_name.split(",").slice(0, 3).join(", "));
    setSuggestions([]);
  };

  // Recommended item click
  const handleRecommendedClick = async (clickedItem) => {
    await fetchItem(clickedItem.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      {/* Back */}
      <div className="p-5">
        <button
          onClick={() => onBack(false)}
          className="px-4 py-2 text-white bg-teal-600 rounded hover:bg-teal-700"
        >
          ← Back to Listings
        </button>
      </div>

      {/* Image */}
      <div className="w-full p-5">
        <img
          src={item?.imageUrl || "https://via.placeholder.com/600"}
          alt={item?.title}
          className="object-cover w-full rounded-lg shadow-md h-96"
        />
      </div>

      {/* Details & Map */}
      <div className="grid grid-cols-1 gap-8 p-5 md:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-teal-700">{item?.title}</h1>
          <p className="text-gray-700">{item?.description}</p>
          <p className="text-sm font-medium text-gray-500">Category: {item?.category}</p>
          <p className="mt-2 text-2xl font-bold text-red-600">₹ {item?.price}</p>
          <p className="text-sm text-gray-500">Seller: {item?.userName}</p>
          <p className="text-sm text-gray-400">Posted: {item?.createdAt}</p>

          {user && (
            <div className="flex gap-4 mt-4">
              {isOwner && (
                <>
                  <button
                    className="px-5 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
                    onClick={handleRemoveAd}
                  >
                    Remove Ad
                  </button>
                  <button
                    className="px-5 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    onClick={toggleEditModal}
                  >
                    Edit Ad
                  </button>
                </>
              )}
              {!isOwner && (
                <button
                  className={`px-5 py-2 font-semibold text-white rounded-md ${
                    wishlistAdded ? "bg-gray-600 hover:bg-gray-700" : "bg-teal-600 hover:bg-teal-700"
                  }`}
                  onClick={handleWishlistToggle}
                >
                  {wishlistAdded ? "Added to Wishlist" : "Add to Wishlist"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="w-full overflow-hidden border rounded-lg shadow-inner h-80">
          {item?.location ? (
            <iframe
              title="location-map"
              width="100%"
              height="100%"
              className="border-0"
              src={`https://www.google.com/maps?q=${encodeURIComponent(item.location)}&output=embed`}
            />
          ) : (
            <p className="p-5 text-gray-500">Location not available</p>
          )}
        </div>
      </div>

      {/* Recommended */}
   {/* Recommended */}
{recommended.length > 0 && (
  <div className="p-5 mt-10">
    <h2 className="mb-4 text-2xl font-semibold text-teal-800">Recommended for you</h2>
    <Card
      items={recommended}
      onCardClick={handleRecommendedClick}
    />
  </div>
)}


      {/* Edit Modal */}
      <Modal show={editModal} size="md" popup={true} position="center" onClick={toggleEditModal}>
        <ModalBody className="relative p-0 bg-white rounded-md" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 pb-8">
            <p className="mb-3 text-lg font-bold">Edit Item</p>
            <form onSubmit={handleEditSubmit}>
              <input
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="Title"
                className="w-full p-3 mb-2 border-2 border-black rounded-md focus:outline-none focus:border-teal-300"
                required
              />
              <select
                value={editData.category}
                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                className="w-full p-3 mb-2 border-2 border-black rounded-md focus:outline-none focus:border-teal-300"
                required
              >
                <option value="">Select Category</option>
                {["Cars","Motorcycles","Mobile Phones","Houses & Apartments","Scooter","Commercial & Other Vehicles","For rent: Houses & Apartments"].map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="relative mb-2">
                <input
                  value={editData.price}
                  onChange={handlePriceChange}
                  placeholder="Price"
                  className="w-full p-3 border-2 border-black rounded-md focus:outline-none focus:border-teal-300"
                  required
                />
                {isPriceValid !== null && (
                  <span className="absolute right-3 top-3.5">
                    {isPriceValid ? <FaCheckCircle className="text-xl text-green-500" /> : <FaTimesCircle className="text-xl text-red-500" />}
                  </span>
                )}
              </div>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Description"
                className="w-full p-3 mb-2 border-2 border-black rounded-md focus:outline-none focus:border-teal-300"
                required
              />
              <div className="relative mb-3">
                <input
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Enter or detect location"
                  className="w-full p-3 border-2 border-black rounded-md focus:outline-none focus:border-teal-300"
                  required
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="absolute right-3 top-3.5 text-blue-600 hover:text-blue-800"
                >
                  {loadingLocation ? <span className="animate-spin">⏳</span> : <FaLocationArrow size={20} />}
                </button>
                {suggestions.length > 0 && (
                  <ul className="absolute left-0 z-50 w-full overflow-hidden overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg top-14 max-h-52 animate-fadeIn">
                    {suggestions.map((s, idx) => (
                      <li key={idx} onClick={() => handleSelectSuggestion(s)} className="px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-blue-100">
                        {s.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="relative w-full pt-2 mb-4">
                {imagePreview ? (
                  <div className="relative flex justify-center w-full h-40 overflow-hidden border-2 border-black rounded-md sm:h-60">
                    <img
                      className="object-contain"
                      src={editData.imageFile ? URL.createObjectURL(editData.imageFile) : imagePreview}
                      alt=""
                    />
                    <input
                      type="file"
                      onChange={(e) => {
                        setEditData({ ...editData, imageFile: e.target.files[0] });
                        setImagePreview(URL.createObjectURL(e.target.files[0]));
                      }}
                      className="absolute inset-0 z-30 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                ) : (
                  <input
                    type="file"
                    onChange={(e) => {
                      setEditData({ ...editData, imageFile: e.target.files[0] });
                      setImagePreview(URL.createObjectURL(e.target.files[0]));
                    }}
                    className="w-full p-3 border-2 border-black rounded-md focus:outline-none focus:border-teal-300"
                  />
                )}
              </div>
              <button
                className="w-full p-3 text-white rounded-lg"
                style={{ backgroundColor: "#002f34" }}
                disabled={submitting}
              >
                {submitting ? "Updating..." : "Update Item"}
              </button>
            </form>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Details;
