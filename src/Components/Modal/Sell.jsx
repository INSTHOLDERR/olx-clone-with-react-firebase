import { Modal, ModalBody } from "flowbite-react";
import { useState } from "react";
import Input from "../Input/Input";
import { UserAuth } from "../Context/Auth";
import { addDoc, collection } from "firebase/firestore";
import { fetchFromFirestore, fireStore } from "../Firebase/Firebase";
import { ToastContainer, toast } from "react-toastify";
import fileUpload from '../../assets/fileUpload.svg';
import loading from '../../assets/loading.gif';
import close from '../../assets/close.svg';
import 'react-toastify/dist/ReactToastify.css';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const Sell = ({ toggleModalSell, status, setItems }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [priceValid, setPriceValid] = useState(null); // null: empty, true: valid, false: invalid
  const [description, setDescription] = useState('');
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

  const handlePriceChange = (e) => {
    const val = e.target.value;
    setPrice(val);
    if (val === "") {
      setPriceValid(null);
    } else if (/^\d+$/.test(val)) {
      setPriceValid(true);
    } else {
      setPriceValid(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!auth?.user) {
      toast.error("Please login to continue");
      return;
    }

    if (!priceValid) {
      toast.error("Price must be a valid number");
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

    let imageUrl = '';
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

    if (!title.trim() || !category || !price.trim() || !description.trim()) {
      toast.error("All fields are required");
      setSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(fireStore, 'products'), {
        title: title.trim(),
        category,
        price: parseInt(price.trim(), 10),
        description: description.trim(),
        imageUrl,
        userId: auth.user.uid,
        userName: auth.user.displayName || 'Anonymous',
        createAt: new Date().toDateString(),
      });

      setImage(null);
      setTitle('');
      setCategory('');
      setPrice('');
      setDescription('');
      setPriceValid(null);

      const datas = await fetchFromFirestore();
      setItems(datas);
      toggleModalSell();
      toast.success("Item added successfully");

    } catch (error) {
      console.log(error);
      toast.error("Failed to add item to Firestore");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Modal
        theme={{
          content: {
            base: "relative w-full p-4 md:h-auto",
            inner: "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
        }}
        onClick={toggleModalSell}
        show={status}
        className="bg-black"
        position="center"
        size="md"
        popup
      >
        <ModalBody className="p-0 bg-white rounded-md h-96" onClick={(e) => e.stopPropagation()}>
          <img
            onClick={() => {
              toggleModalSell();
              setImage(null);
            }}
            className="absolute z-10 w-6 cursor-pointer top-6 right-8"
            src={close} alt=""
          />

          <div className="p-6 pb-8 pl-8 pr-8">
            <p className="mb-3 text-lg font-bold">Sell Item</p>

            <form onSubmit={handleSubmit}>
              <Input setInput={setTitle} placeholder="Title" />

              {/* Category Select */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 mb-2 border-2 border-black rounded-md focus:outline-none focus:border-teal-300"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Price Input with validation icon */}
              <div className="relative mb-2">
                <input
                  value={price}
                  onChange={handlePriceChange}
                  placeholder="Price"
                  className="w-full p-3 border-2 border-black rounded-md focus:outline-none focus:border-teal-300"
                />
                {priceValid === true && (
                  <CheckCircleIcon className="absolute w-5 h-5 text-green-500 top-3 right-3" />
                )}
                {priceValid === false && (
                  <XCircleIcon className="absolute w-5 h-5 text-red-500 top-3 right-3" />
                )}
              </div>

              <Input setInput={setDescription} placeholder="Description" />

              {/* Image Upload */}
              <div className="relative w-full pt-2">
                {image ? (
                  <div className="relative flex justify-center w-full h-40 overflow-hidden border-2 border-black border-solid rounded-md sm:h-60">
                    <img className="object-contain" src={URL.createObjectURL(image)} alt="" />
                  </div>
                ) : (
                  <div className="relative w-full h-40 border-2 border-black border-solid rounded-md sm:h-60">
                    <input
                      onChange={handleImageUpload}
                      type="file"
                      className="absolute inset-0 z-30 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center">
                      <img className="w-12" src={fileUpload} alt="" />
                      <p className="pt-2 text-sm text-center">Click to upload images</p>
                      <p className="pt-2 text-sm text-center">SVG, PNG, JPG</p>
                    </div>
                  </div>
                )}
              </div>

              {submitting ? (
                <div className="flex justify-center w-full pt-4 pb-2 h-14">
                  <img className="object-cover w-32" src={loading} alt="" />
                </div>
              ) : (
                <div className="w-full pt-2">
                  <button
                    className="w-full p-3 text-white rounded-lg"
                    style={{ backgroundColor: '#002f34' }}
                  >
                    Sell Item
                  </button>
                </div>
              )}
            </form>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Sell;
