import React, { useEffect, useState } from "react";

const History = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseHistory = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setPurchaseHistory([]);
        setLoading(false);
        return;
      }

      const storedHistory =
        JSON.parse(localStorage.getItem("purchaseHistory")) || [];

      const validHistory = storedHistory.filter((item) => {
        return item.foodId && item.restaurantId;
      });

      if (validHistory.length !== storedHistory.length) {
        localStorage.setItem("purchaseHistory", JSON.stringify(validHistory));
      }

      setPurchaseHistory(validHistory);
      setLoading(false);
    };

    fetchPurchaseHistory();
  }, []);

  return (
    <div className="flex flex-col min-h-screen max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-row items-center justify-between w-full mb-6">
        <h1 className="text-2xl font-bold">Purchase History</h1>
      </div>

      {/* Loading State */}
      {loading ? (
        <p>Loading your purchase history...</p>
      ) : (
        <>
          {/* Empty History State */}
          {purchaseHistory.length === 0 ? (
            <div>
              <p className="text-gray-600">You have no purchase history.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {purchaseHistory.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-4">
                    <h3 className="font-bold text-lg truncate">{item.name}</h3>
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-lg mt-2"
                    />
                    <p className="mt-2">
                      Total: Rp {item.total.toLocaleString("id-ID")}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Date: {item.date}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Restaurant ID: {item.restaurantId}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Food ID: {item.foodId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;
