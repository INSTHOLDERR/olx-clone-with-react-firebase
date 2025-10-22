import React from 'react';

const Card = ({ items, title, onCardClick }) => {
  return (
    <div className="min-h-screen p-10 px-5 sm:px-15 md:px-30 lg:px-40">
      {title && (
        <h1 style={{ color: '#002f34' }} className="text-2xl font-semibold">
          {title}
        </h1>
      )}

      <div className="grid grid-cols-1 gap-4 pt-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onCardClick(item)}
            className="relative w-full overflow-hidden transition-shadow duration-300 border border-gray-300 rounded-md cursor-pointer h-72 bg-gray-50 hover:shadow-md"
          >
            <div className="flex justify-center w-full p-2 overflow-hidden">
              <img
                className="object-contain h-36"
                src={item.imageUrl || 'https://via.placeholder.com/150'}
                alt={item.title}
              />
            </div>

            <div className="p-2 pl-4 pr-4 details">
              <h1 style={{ color: '#002f34' }} className="text-xl font-bold">
                ₹ {item.price}
              </h1>
              <p className="pt-2 text-sm text-gray-600">{item.category}</p>
              <p className="pt-2 text-gray-800">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
