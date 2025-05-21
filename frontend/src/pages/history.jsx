import React, { useEffect, useState } from "react";
import { getTransactionHistory } from "../services/UserService";
import RestoService from "../services/RestoService";
import OrderService from "../services/OrderService";

const History = () => {
  const [loading, setLoading] = useState(true);
  const [status0, setStatus0] = useState([]);
  const [status1, setStatus1] = useState([]);
  const [completedTransactions, setCompletedTransactions] = useState([]);
  const [ratings, setRatings] = useState({});
  const [submittedRatings, setSubmittedRatings] = useState([]);

  // Load submittedRatings dari localStorage saat komponen dimount
  useEffect(() => {
    const savedRatings = localStorage.getItem("submittedRatings");
    if (savedRatings) {
      setSubmittedRatings(JSON.parse(savedRatings));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = localStorage.getItem("role");
        let history = [];

        if (role === "restaurant") {
          history = await RestoService.getRestaurantTransactions();
        } else {
          history = await getTransactionHistory();
        }

        const filtered0 = history.filter((item) => item.status === 0);
        const filtered1 = history.filter((item) => item.status === 1);

        // Separate status1 into rated and not rated
        const savedRatings = localStorage.getItem("submittedRatings");
        const submittedRatingIds = savedRatings ? JSON.parse(savedRatings) : [];

        const notRated = filtered1.filter(
          (item) => !submittedRatingIds.includes(item.transaction_id)
        );
        const rated = filtered1.filter((item) =>
          submittedRatingIds.includes(item.transaction_id)
        );

        setStatus0(filtered0);
        setStatus1(notRated);
        setCompletedTransactions(rated);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [submittedRatings]);

  const handleRatingClick = (transactionId, value) => {
    setRatings((prev) => ({ ...prev, [transactionId]: value }));
  };

  const submitRating = async (restaurant_id, transactionId) => {
    const token = localStorage.getItem("token");
    const rating = ratings[transactionId];

    if (!rating || rating < 1 || rating > 5) {
      alert("Please click a rating between 1 and 5 stars.");
      return;
    }

    try {
      await RestoService.rateRestaurant(restaurant_id, rating, token);
      alert("Thank you for your rating!");

      const updated = [...submittedRatings, transactionId];
      setSubmittedRatings(updated);
      localStorage.setItem("submittedRatings", JSON.stringify(updated));

      // Move transaction from status1 to completedTransactions
      const ratedTransaction = status1.find(
        (item) => item.transaction_id === transactionId
      );
      if (ratedTransaction) {
        setStatus1((prev) =>
          prev.filter((item) => item.transaction_id !== transactionId)
        );
        setCompletedTransactions((prev) => [...prev, ratedTransaction]);
      }
    } catch (error) {
      alert("Failed to submit rating.");
    }
  };

  const handleVerifyClick = async (transactionId) => {
    try {
      const result = await OrderService.verifyTransaction(transactionId);
      alert("Transaction verified!");

      // optionally refetch list or update local state
      fetchData();
    } catch (err) {
      console.error("Failed to verify:", err);
      alert(err.response?.data?.message || "Verification failed.");
    }
  };

  const renderStars = (transactionId, isReadOnly = false) => {
    const currentRating = ratings[transactionId] || 0;
    const isLocked = submittedRatings.includes(transactionId);

    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        onClick={() =>
          !isLocked && !isReadOnly && handleRatingClick(transactionId, i + 1)
        }
        style={{
          cursor: isLocked || isReadOnly ? "default" : "pointer",
          color: i < currentRating ? "#facc15" : "#d1d5db",
          fontSize: "24px",
          pointerEvents: isLocked || isReadOnly ? "none" : "auto",
        }}
      >
        ★
      </span>
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID");
  };

  return (
    <div className="flex flex-col min-h-screen max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Purchase History</h1>

      {loading ? (
        <p>Loading your purchase history...</p>
      ) : (
        <>
          {status0.length === 0 &&
          status1.length === 0 &&
          completedTransactions.length === 0 ? (
            <p className="text-gray-600 mb-8">You have no purchase history.</p>
          ) : (
            <>
              {status0.length > 0 &&
                (localStorage.getItem("role") === "restaurant" ? (
                  // Tampilan untuk restoran (tabel)
                  <div className="mb-12">
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-xl shadow-md">
                        <thead>
                          <tr className="bg-green-100 text-left text-sm font-medium text-green-700">
                            <th className="py-3 px-4">No</th>
                            <th className="py-3 px-4">Booking Code</th>
                            <th className="py-3 px-4">Food</th>
                            <th className="py-3 px-4">Total</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {status0.map((item, index) => (
                            <tr key={index} className="border-t text-sm">
                              <td className="py-3 px-4">{index + 1}</td>
                              <td className="py-3 px-4">{item.booking_code}</td>
                              <td className="py-3 px-4 flex items-center gap-2">
                                <img
                                  src={item.food.photo}
                                  alt={item.food.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                                <span>{item.food.name}</span>
                              </td>
                              <td className="py-3 px-4">
                                Rp {item.total.toLocaleString("id-ID")}
                              </td>
                              <td className="py-3 px-4">
                                {formatDate(item.date)}
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                                  onClick={() =>
                                    handleVerifyClick(item.transaction_id)
                                  }
                                >
                                  Verify
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  // Tampilan untuk user biasa (kartu)
                  <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-4">
                      Waiting to be verified
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {status0.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl shadow-lg overflow-hidden p-4"
                        >
                          <h3 className="font-bold text-lg truncate">
                            {item.name}
                          </h3>
                          <img
                            src={item.food.photo}
                            alt={item.food.name}
                            className="w-full h-40 object-cover rounded-lg mt-2"
                          />
                          <p className="mt-2">
                            Total: Rp {item.total.toLocaleString("id-ID")}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Date: {formatDate(item.date)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

              {/* Please give us your rating */}
              {localStorage.getItem("role") !== "restaurant" &&
                status1.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 text-black">
                      Please give us your rating
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {status1.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl shadow-lg overflow-hidden p-4"
                        >
                          <h3 className="font-bold text-lg truncate">
                            {item.name}
                          </h3>
                          <img
                            src={item.food.photo}
                            alt={item.food.name}
                            className="w-full h-40 object-cover rounded-lg mt-2"
                          />
                          <p className="mt-2">
                            Total: Rp {item.total.toLocaleString("id-ID")}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Date: {formatDate(item.date)}
                          </p>

                          <div className="mt-4">
                            <p className="text-sm font-medium mb-1">
                              Your Rating:
                            </p>
                            <div className="flex space-x-1">
                              {renderStars(item.transaction_id)}
                            </div>
                            <button
                              onClick={() =>
                                submitRating(
                                  item.restaurant.restaurant_id,
                                  item.transaction_id
                                )
                              }
                              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            >
                              Submit Rating
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Completed Transactions */}
              {completedTransactions.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-black">
                    Completed Transactions
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {completedTransactions.map((item, index) => (
                      <div
                        key={index}
                        className="bg-green-100 rounded-xl shadow-lg overflow-hidden p-4 border border-green-300"
                      >
                        <h3 className="font-bold text-lg truncate">
                          {item.name}
                        </h3>
                        <img
                          src={item.food.photo}
                          alt={item.food.name}
                          className="w-full h-40 object-cover rounded-lg mt-2"
                        />
                        <p className="mt-2 text-green-600">
                          Total: Rp {item.total.toLocaleString("id-ID")}
                        </p>
                        <p className="text-sm text-green-600 mt-1">
                          Date: {formatDate(item.date)}
                        </p>

                        <div className="mt-4">
                          <div className="mt-2 flex items-center text-sm text-green-400">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            Rating submitted
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default History;
