import { Modal, ModalBody, Carousel } from "flowbite-react"
import google from '../../assets/google.png'
import mobile from '../../assets/mobile.svg'
import guitar from '../../assets/guita.png'
import love from '../../assets/love.png'
import avatar from '../../assets/avatar.png'
import close from '../../assets/close.svg'
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../Firebase/Firebase"




const Login = ({toggleModal, status}) => {
   const handleClick = async()=>{
    try {

     const result =   await signInWithPopup(auth,provider);
        toggleModal();
        console.log('User' , result.user);
    } catch (error) {
        console.log(error);
        
        
    }
   }
  return (
    <div>
            <Modal theme={{
                "content": {
                    "base": "relative w-full p-4 md:h-auto",
                    "inner": "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700"
                },
            }} onClick={toggleModal} className="bg-black rounded-none" position={'center'} show={status} size="md" popup={true}>
                <div onClick={(event)=> event.stopPropagation()}   className="p-6 pl-2 pr-2 bg-white">
                    <img onClick={toggleModal} className="absolute z-10 w-6 cursor-pointer top-4 right-4" src={close} alt="" />
                    <Carousel slide={false} theme={{
                        "indicators": {
                            "active": {
                                "off": "bg-gray-300",
                                "on": "bg-teal-300"
                            },
                            "base": "h-2 w-2 rounded-full",
                            "wrapper": "absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-3"
                        },
                        "scrollContainer": {
                            "base": "flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth",
                            "snap": "snap-x"
                        }, "control": {
                            "base": "inline-flex items-center justify-center bg-transparent",
                            "icon": "w-8 text-black dark:text-black"
                        },
                    }}  onClick={(event)=>{event.stopPropagation()}}   className="w-full h-56 pb-5 rounded-none">
                        <div className="flex flex-col items-center justify-center">
                            <img className="w-24 pb-5" src={guitar} alt="Car Image 1" />
                            <p style={{ color: '#002f34' }} className="pb-5 font-semibold text-center  w-60 sm:w-72">Help us become one of the safest place to buy and sell.</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <img className="w-24 pb-5" src={love} alt="Car Image 2" />
                            <p style={{ color: '#002f34' }} className="pb-5 font-semibold text-center  w-60 sm:w-72">Close deals from the comfort of your home.</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <img className="w-24 pb-5" src={avatar} alt="Car Image 3" />
                            <p style={{ color: '#002f34' }} className="pb-5 font-semibold text-center  w-60 sm:w-72">Keep all your favorites in one place.</p>
                        </div>
                    </Carousel>
                </div>

                <ModalBody className="p-0 bg-white rounded-none h-96" onClick={(event)=> {event.stopPropagation()}} >

                    <div className="p-6 pt-0">
                        <div className="relative flex items-center justify-start h-8 p-5 pl-4 mb-4 border-2 border-black border-solid rounded-md">
                            <img className="w-6 mr-2" src={mobile} alt="" />
                            <p className="text-sm font-bold">Continue with phone</p>
                        </div>
                        <div  className="relative flex items-center justify-center h-8 p-5 border-2 border-gray-300 border-solid rounded-md cursor-pointer active:bg-teal-100"   onClick={handleClick} >
                            <img className="absolute w-7 left-2" src={google} alt="" />
                            <p className="text-sm text-gray-500" >Continue with Google</p>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-5">
                            <p className="text-sm font-semibold">OR</p>
                            <p className="pt-3 text-sm font-bold underline underline-offset-4">Login with Email</p>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-10 sm:pt-20">
                            <p className="text-xs">All your personal details are safe with us.</p>
                            <p className="pt-5 text-xs text-center">If you continue, you are accepting <span className="text-blue-600">OLX Terms and Conditions and Privacy Policy</span></p>
                        </div>
                    </div>

                </ModalBody>
            </Modal>
        </div>
  )
}

export default Login