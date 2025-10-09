import './Navbar.css'
import logo from '../../assets/symbol.png'
import search from '../../assets/search1.svg'
import arrow from '../../assets/arrow-down.svg'
import searchWt from '../../assets/search.svg'
import {useAuthState} from 'react-firebase-hooks/auth'
import { auth } from '../Firebase/Firebase'
import addBtn from '../../assets/addButton.png'


const Navbar = (props) => {
    const [user] = useAuthState(auth)
    const {toggleModal ,toggleModalSell } = props
  return (
    <div>
           <nav className="fixed z-50 w-full p-2 pl-3 pr-3 overflow-auto border-b-4 border-solid shadow-md bg-slate-100 border-b-white">
                <img src={logo} alt="" className='w-12 ' />
                <div className='relative ml-5 location-search'>
                    <img src={search} alt="" className='absolute w-5 top-4 left-2' />
                    <input placeholder='Search city, area, or locality...' className='w-[50px] sm:w-[150px] md:w-[250] lg:w-[270px] p-3 pl-8 pr-8 border-black border-solid border-2 rounded-md placeholder:text-ellipsis focus:outline-none focus:border-teal-300' type="text" />
                    <img  src={arrow} alt="" className='absolute w-5 cursor-pointer top-4 right-3' />
                </div>

                <div className="relative w-full ml-5 mr-2 main-search">
                    <input placeholder='Find Cars, Mobile Phones, and More...' className='w-full p-3 border-2 border-black border-solid rounded-md placeholder:text-ellipsis focus:outline-none focus:border-teal-300' type="text" />
                    <div style={{ backgroundColor: '#002f34' }} className="absolute top-0 right-0 flex items-center justify-center w-12 h-full rounded-e-md">
                        <img className="w-5 filter invert" src={searchWt} alt="Search Icon" />
                    </div>
                </div>

                <div className="relative mx-1 sm:ml-5 sm:mr-5 lang">
                    <p className="mr-3 font-bold" >English</p>
                    <img src={arrow} alt="" className='w-5 cursor-pointer' />
                </div>

                {!user ? (
                    <p className='ml-5 font-bold underline cursor-pointer' style={{color: '#002f34'}}>Login</p>
                ) : (
                    <div className='relative'>
                        <p style={{color: '#002f34'}} className='ml-5 font-bold cursor-pointer'>{user.displayName?.split(' ')[0] }</p>

                    </div>
                )}

              <img src={addBtn} 
              onClick={ user ? toggleModalSell : toggleModal}
               className='w-24 mx-1 rounded-full shadow-xl cursor-pointer sm:ml-5 sm:mr-5'
                alt="" />
            </nav>

            <div className='relative z-0 flex w-full p-2 pt-20 pl-10 pr-10 shadow-md sm:pl-44 md:pr-44 sub-lists'>
                <ul className='flex items-center justify-between w-full list-none'>
                    <div  className='flex flex-shrink-0'>
                        <p  className='font-semibold uppercase all-cats'> All categories</p>
                        <img className='w-4 ml-2' src={arrow} alt="" />

                    </div>

                    <li>Cars</li>
                    <li>Motorcycles</li>
                    <li>Mobile Phones</li>
                    <li>For sale : Houses & Apartments</li>
                    <li>Scooter</li>
                    <li>Commercial & Other Vehicles</li>
                    <li>For rent : Houses & Apartments</li>

                </ul>

            </div>


          
    </div>
  )
}

export default Navbar;