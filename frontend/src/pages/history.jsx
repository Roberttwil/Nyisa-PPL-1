import React from 'react';

const History = () => {
  const purchaseHistory = [
    {
      id: 1,
      name: 'Licensed Bronze Ball',
      quantity: 4,
      price: 69332,
      total: 69332 * 4,
      date: '2025-04-20',
      photo: 'https://via.placeholder.com/150',
    },
    // Tambahkan item lain jika perlu
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Purchase History</h1>

      {purchaseHistory.length === 0 ? (
        <p className="text-gray-600">You have no purchase history.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {purchaseHistory.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg mt-2"
                />
                <p className="mt-2">Unit Price: Rp {item.price.toLocaleString('id-ID')}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Total: Rp {item.total.toLocaleString('id-ID')}</p>
                <p className="text-sm text-gray-500 mt-1">Date: {item.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
