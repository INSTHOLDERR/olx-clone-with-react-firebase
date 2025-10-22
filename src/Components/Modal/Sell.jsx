import { Modal, ModalBody } from "flowbite-react";
import { useState, useEffect } from "react";
import Input from "../Input/Input";
import { UserAuth } from "../Context/Auth";
import { addDoc, collection } from "firebase/firestore";
import { fetchFromFirestore, fireStore } from "../Firebase/Firebase";
import { toast } from "react-toastify";
import fileUpload from "../../assets/fileUpload.svg";
import loading from "../../assets/loading.gif";
import close from "../../assets/close.svg";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle, FaTimesCircle, FaLocationArrow } from "react-icons/fa";

const Sell = ({ toggleModalSell, status, setItems }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [isPriceValid, setIsPriceValid] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const auth = UserAuth();

  const categories = [
    "Cars",
    "Motorcycles",
    "Mobile Phones",
    "Houses & Apartments",
    "Scooter",
    "Commercial & Other Vehicles",
    "For rent: Houses & Apartments",
  ];

  const handleImageUpload = (event) => {
    if (event.target.files) setImage(event.target.files[0]);
  };

  // ✅ Handle Price Validation
  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPrice(value);
    setIsPriceValid(/^\d*$/.test(value));
  };

  // ✅ Get Current Location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by this browser");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          const locationName =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.display_name ||
            `${latitude}, ${longitude}`;

          setLocation(locationName);
          toast.success("Current location fetched!");
        } catch (error) {
          console.log(error);
          toast.error("Failed to fetch location name");
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        toast.error("Location access denied");
        setLoadingLocation(false);
      }
    );
  };

  // ✅ Fetch Location Suggestions as User Types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (location.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${location}&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.log(error);
      }
    };

    const delay = setTimeout(() => {
      fetchSuggestions();
    }, 400);

    return () => clearTimeout(delay);
  }, [location]);

  // ✅ Select Suggestion
  const handleSelectSuggestion = (s) => {
    const formatted = s.display_name.split(",").slice(0, 3).join(", ");
    setLocation(formatted);
    setSuggestions([]);
  };

  // ✅ Submit Form
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!auth?.user) {
      toast.error("Please login to continue");
      return;
    }

    if (!/^\d+$/.test(price.trim())) {
      toast.error("Price must be a number");
      return;
    }

    setSubmitting(true);

    const readImageAsDataUrl = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result;
          localStorage.setItem(`image_${file.name}`, imageUrl);
          resolve(imageUrl);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    let imageUrl = "";
    if (image) {
      try {
        imageUrl = await readImageAsDataUrl(image);
      } catch (error) {
        console.log(error);
        toast.error("Failed to read image");
        setSubmitting(false);
        return;
      }
    }

    if (!title.trim() || !category || !price.trim() || !description.trim() || !location.trim()) {
      toast.error("All fields are required");
      setSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(fireStore, "products"), {
        title: title.trim(),
        category,
        price: parseInt(price.trim()),
        description: description.trim(),
        location: location.trim(),
        imageUrl,
        userId: auth.user.uid,
        userName: auth.user.displayName || "Anonymous",
        createdAt: new Date().toDateString(),
      });

      setImage(null);
      setTitle("");
      setCategory("");
      setPrice("");
      setDescription("");
      setLocation("");

      const datas = await fetchFromFirestore();
      setItems(datas);
      toggleModalSell();
      toast.success("Item added successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      onClick={toggleModalSell}
      show={status}
      className="bg-black"
      position={"center"}
      size="md"
      popup={true}
    >
      <ModalBody
        className="relative p-0 bg-white rounded-md"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          onClick={() => {
            toggleModalSell();
            setImage(null);
          }}
          className="absolute z-10 w-6 cursor-pointer top-6 right-8"
          src={close}
          alt=""
        />

        <div className="p-6 pb-8 pl-8 pr-8">
          <p className="mb-3 text-lg font-bold">Sell Item</p>

          <form onSubmit={handleSubmit}>
            <Input setInput={setTitle} placeholder="Title" />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 mb-2 border-2 border-black rounded-md focus:outline-none focus:border-teal-300"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* ✅ Price Field */}
            <div className="relative mb-2">
              <input
                value={price}
                onChange={handlePriceChange}
                placeholder="Price"
                className="w-full p-3 border-2 border-black rounded-md focus:outline-none focus:border-teal-300"
                required
              />
              {isPriceValid !== null && (
                <span className="absolute right-3 top-3.5">
                  {isPriceValid ? (
                    <FaCheckCircle className="text-xl text-green-500" />
                  ) : (
                    <FaTimesCircle className="text-xl text-red-500" />
                  )}
                </span>
              )}
            </div>

            <Input setInput={setDescription} placeholder="Description" />

            {/* ✅ Location Field with Suggestions */}
            <div className="relative mb-3">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter or detect location"
                className="w-full p-3 border-2 border-black rounded-md focus:outline-none focus:border-teal-300"
                required
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="absolute right-3 top-3.5 text-blue-600 hover:text-blue-800"
              >
                {loadingLocation ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <FaLocationArrow size={20} />
                )}
              </button>

              {suggestions.length > 0 && (
                <ul className="absolute left-0 z-50 w-full overflow-hidden overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg top-14 max-h-52 animate-fadeIn">
                  {suggestions.map((s, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectSuggestion(s)}
                      className="px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-blue-100"
                    >
                      {s.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ✅ Image Upload */}
            <div className="relative w-full pt-2">
              {image ? (
                <div className="relative flex justify-center w-full h-40 overflow-hidden border-2 border-black border-solid rounded-md sm:h-60">
                  <img
                    className="object-contain"
                    src={URL.createObjectURL(image)}
                    alt=""
                  />
                </div>
              ) : (
                <div className="relative w-full h-40 border-2 border-black border-solid rounded-md sm:h-60">
                  <input
                    onChange={handleImageUpload}
                    type="file"
                    className="absolute inset-0 z-30 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <img className="w-12" src={fileUpload} alt="" />
                    <p className="pt-2 text-sm text-center">
                      Click to upload images
                    </p>
                    <p className="pt-2 text-sm text-center">SVG, PNG, JPG</p>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ Like Icon (only if user logged in) */}
            {auth?.user && (
              <div className="flex justify-center pt-4">
                <img
                  src="data:image/svg+xml,%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20fill='%23002f34'%20height='30px'%20width='30px'%20version='1.1'%20id='XMLID_298_'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%3e%3cpath%20d='M12,23.2l-0.6-0.5C8.7,20.7,0,13.5,0,7.3C0,3.8,2.9,1,6.5,1c2.2,0,4.3,1.1,5.5,2.9C13.2,2.1,15.3,1,17.5,1C21.1,1,24,3.8,24,7.3c0,6.3-8.7,13.4-11.4,15.5L12,23.2z'/%3e%3c/svg%3e"
                  alt="like icon"
                  className="cursor-pointer"
                />
              </div>
            )}

            {/* ✅ Submit Button */}
            {submitting ? (
              <div className="flex justify-center w-full pt-4 pb-2 h-14">
                <img className="object-cover w-32" src={loading} alt="" />
              </div>
            ) : (
              <div className="w-full pt-2">
                <button
                  className="w-full p-3 text-white rounded-lg"
                  style={{ backgroundColor: "#002f34" }}
                >
                  Sell Item
                </button>
              </div>
            )}
          </form>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default Sell;
