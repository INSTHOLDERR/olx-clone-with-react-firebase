import { Modal, ModalBody } from "flowbite-react"
import { useState } from "react"
import Input from "../Input/Input"
import { UserAuth } from "../Context/Auth"
import { addDoc, collection } from "firebase/firestore"
import { fetchFromFirestore, fireStore } from "../Firebase/Firebase"
import fileUpload from '../../assets/fileUpload.svg'
import loading from '../../assets/loading.gif'
import close from '../../assets/close.svg'



const Sell = (props) => {  
    const {toggleModalSell,status ,setItems} = props

    const [title,setTitle] = useState('')
    const [category,setCategory] = useState('')
    const [price,setPrice] = useState('')
    const [description,setDescription] = useState('')
    const [image,setImage] = useState(null)

    const [submitting,setSubmitting] = useState(false)

    const auth = UserAuth();

    const handleImageUpload = (event)=>{
        if(event.target.files) setImage(event.target.files[0])
    }
    
    const handleSubmit = async (event)=>{
        event.preventDefault();

        if(!auth?.user){
            alert('Please login to continue');
            return;
        }

        setSubmitting(true)

        const readImageAsDataUrl =(file) =>{
            return new Promise((resolve,reject) =>{
                const reader = new FileReader();
                reader.onloadend = ()=>{
                    const imageUrl = reader.result
                    localStorage.setItem(`image_${file.name}`, imageUrl)
                    resolve(imageUrl)
                }
                reader.onerror = reject
                reader.readAsDataURL(file)
            })
        }

        let imageUrl = '';
        if(image){
            try {
                imageUrl = await readImageAsDataUrl(image)
                
            } catch (error) {
                console.log(error)
                alert('falied to read image');
                return;
                
            }
        }

        const trimmedTitle = title.trim();
        const trimmedCategory = category.trim();
        const trimmedPrice = price.trim();
        const trimmedDescription = description.trim();
  

        if(!trimmedTitle || !trimmedCategory ||!trimmedPrice || !trimmedDescription  ){
            alert('All fields are required');
            setSubmitting(false)
            return;
        }

        try {

            await addDoc(collection(fireStore, 'products'), {
                title,
                category,
                price,
                description,
                imageUrl,
                userId: auth.user.uid,
                userName: auth.user.displayName || 'Anonymous',
                createAt: new Date().toDateString(),
            });

            setImage(null);
            const datas = await fetchFromFirestore();
            setItems(datas)
            toggleModalSell();
            
        } catch (error) {
            console.log(error);
            alert('failed to add items to the firestore')
            
        }finally{
            setSubmitting(false)
        }

        

    }



  return (
    <div>
        <Modal  theme={{
             "content": {
                "base": "relative w-full p-4 md:h-auto",
                "inner": "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700"
            },
        }}  onClick={toggleModalSell} show={status}  className="bg-black"  position={'center'}  size="md" popup= {true}>
            <ModalBody  className="p-0 bg-white rounded-md h-96"   onClick={(event) => event.stopPropagation()}>
                <img 
                onClick={()=>{
                    toggleModalSell();
                    setImage(null);
                }}
                className="absolute z-10 w-6 cursor-pointer top-6 right-8"
                src={close} alt="" />
               
                <div className="p-6 pb-8 pl-8 pr-8">
                    <p  className="mb-3 text-lg font-bold">Sell Item</p>

                    <form  onSubmit={handleSubmit}>
                       <Input setInput={setTitle} placeholder ='Title' />
                       <Input setInput={setCategory} placeholder='category'/>
                       <Input setInput={setPrice} placeholder='Price'/>
                       <Input setInput={setDescription} placeholder='Description'/>

                       <div  className="relative w-full pt-2">
                        
                       {image ? (

                        <div className="relative flex justify-center w-full h-40 overflow-hidden border-2 border-black border-solid rounded-md sm:h-60">
                            <img  className="object-contain" src={URL.createObjectURL(image)}   alt="" />
                        </div>
                       ) : (
                        <div  className="relative w-full h-40 border-2 border-black border-solid rounded-md sm:h-60">
                            <input
                            onChange={handleImageUpload}
                            type="file" 
                            className="absolute z-30 w-full h-full opacity-0 cursor-pointer inset-10"
                            required
                            />

                            <div  className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center">
                                <img  className="w-12" src={fileUpload} alt="" />
                                <p  className="pt-2 text-sm text-center">Click to upload images</p>
                                <p  className="pt-2 text-sm text-center">SVG, PNG, JPG</p>
                            </div>
                        </div>
                       )} 

                       </div>
                       

                       {
                        submitting? (
                            <div  className="flex justify-center w-full pt-4 pb-2 h-14">
                                <img className="object-cover w-32" src={loading} alt="" />

                            </div>
                        ) : (

                            <div  className="w-full pt-2">
                                <button  className="w-full p-3 text-white rounded-lg"
                                style={{ backgroundColor: '#002f34' }}
                                > Sell Item </button>
                            </div>
                        )
                       }
                     
                    </form>
                </div>
            </ModalBody>

        </Modal  >

      
    </div>
  )
}

export default Sell
