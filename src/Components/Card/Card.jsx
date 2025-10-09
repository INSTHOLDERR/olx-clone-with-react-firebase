import React from 'react'
import { Link } from 'react-router-dom'
import Favorite from '../../assets/favorite.svg'


const Card = ({items}) => {
  return (
    <div  className='min-h-screen p-10 px-5 sm:px-15 md:px-30 lg:px-40' >

   <h1 style={{ color: '#002f34' }} className="text-2xl">Fresh recommendations</h1>

      <div  className='grid grid-cols-1 gap-4 pt-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' >
        {items.map((item)=> (
          <Link 
           to={'/details'}  
           state={{item}}  
           key={item.id}   
           style={{ borderWidth: '1px', borderColor:'lightgrey'}}> 

          <div key={item.id}  
          style={{borderWidth: '1px', borderColor: 'lightgray'}} 
          className='relative w-full overflow-hidden border-solid rounded-md cursor-pointer h-72 bg-gray-50'
          >

            {/* Display Images */}
            <div  className='flex justify-center w-full p-2 overflow-hidden'>
              <img
              className='object-contain h-36'
               src={item.imageUrl || 'https://via.placeholder.com/150'}  alt={item.title} />

            </div>

            {/* Display details */}
            <div  className='p-1 pl-4 pr-4 details' >
            <h1 style={{ color: '#002f34' }} className="text-xl font-bold">₹ {item.price}</h1>
            <p className="pt-2 text-sm">{item.category}</p>
            <p className="pt-2">{item.title}</p>

         {/* Fav Icon */}

         <div   className='absolute flex items-center justify-center p-2 bg-white rounded-full cursor-pointer top-3 right-3'>
          <img className='w-5' src={Favorite} alt="" />
         </div>

            </div>
          </div>
          </Link>

        ))}

      </div>
      
    </div>
  )
}

export default Card
