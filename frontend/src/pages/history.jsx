import React, { useEffect, useState } from "react";

const History = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    const fetchPurchaseHistory = () => {
      // Check if the user is logged in (i.e., check for a token in localStorage)
      const token = localStorage.getItem("token"); // Or any other method you're using to store user info

      if (!token) {
        // If the user is not logged in, set history to an empty array and return early
        setPurchaseHistory([]);
        return;
      }

      // If user is logged in, proceed with fetching the history
      const storedHistory = JSON.parse(localStorage.getItem("purchaseHistory")) || [];

      // Check if any items need to be removed (this could be based on any condition you like)
      const validHistory = storedHistory.filter(item => {
        // Example condition: Check if the food_id or restaurant_id is valid
        return item.foodId && item.restaurantId;  // Replace with your own criteria
      });

      // If the valid history is different from the stored history, update localStorage
      if (validHistory.length !== storedHistory.length) {
        localStorage.setItem("purchaseHistory", JSON.stringify(validHistory));
      }

      setPurchaseHistory(validHistory);
    };

    fetchPurchaseHistory();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Purchase History</h1>

      {/* Check if purchaseHistory is empty and show message accordingly */}
      {purchaseHistory.length === 0 ? (
        <p className="text-gray-600">You have no purchase history.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {purchaseHistory.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4">
                <h3 className="font-bold text-lg truncate">{item.name}</h3>
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg mt-2"
                />
                <p className="mt-2">Total: Rp {item.total.toLocaleString("id-ID")}</p>
                <p className="text-sm text-gray-500 mt-1">Date: {item.date}</p>
                <p className="text-sm text-gray-500 mt-1">Restaurant ID: {item.restaurantId}</p>
                <p className="text-sm text-gray-500 mt-1">Food ID: {item.foodId}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
