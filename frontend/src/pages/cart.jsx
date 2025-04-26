import React from 'react';

const Cart = () => {
  const item = {
    name: 'Licensed Bronze Ball',
    price: 69332,
    quantity: 4,
    photo: 'https://via.placeholder.com/150', // Gambar placeholder
  };

  const total = item.price * item.quantity;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4">
              <h3 className="font-bold text-lg">{item.name}</h3>
              <img
                src={item.photo}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg mt-2"
              />
              <p className="mt-2">Unit Price: Rp {item.price.toLocaleString('id-ID')}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <div className="flex justify-between items-center p-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Total harga */}
        <div className="mt-6 flex justify-between items-center">
          <h3 className="text-xl font-bold">Total: Rp {total.toLocaleString('id-ID')}</h3>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
