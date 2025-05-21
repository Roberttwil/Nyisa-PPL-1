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

  // Updated popup state to match Cart.jsx
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });

  // Updated confirmation modal state to match Cart.jsx
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: null,
    title: "",
    message: "",
  });

  // Load submittedRatings from localStorage when component mounts
  useEffect(() => {
    const savedRatings = localStorage.getItem("submittedRatings");
    if (savedRatings) {
      setSubmittedRatings(JSON.parse(savedRatings));
    }
  }, []);

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
      setPopup({
        show: true,
        type: "error",
        message: "Unable to load transaction history. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [submittedRatings]);

  const handleRatingClick = (transactionId, value) => {
    setRatings((prev) => ({ ...prev, [transactionId]: value }));
  };

  const submitRating = async (restaurant_id, transactionId) => {
    const token = localStorage.getItem("token");
    const rating = ratings[transactionId];

    if (!rating || rating < 1 || rating > 5) {
      setPopup({
        show: true,
        type: "warning",
        message: "Please click a rating between 1 and 5 stars.",
      });
      return;
    }

    try {
      await RestoService.rateRestaurant(restaurant_id, rating, token);

      setPopup({
        show: true,
        type: "success",
        message: "Thank you for your feedback! Your rating has been recorded.",
      });

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
      setPopup({
        show: true,
        type: "error",
        message: "We couldn't submit your rating. Please try again.",
      });
    }
  };

  const initiateRatingSubmission = (restaurant_id, transactionId) => {
    const rating = ratings[transactionId];

    if (!rating || rating < 1 || rating > 5) {
      setPopup({
        show: true,
        type: "warning",
        message: "Please click a rating between 1 and 5 stars.",
      });
      return;
    }

    setConfirmModal({
      show: true,
      title: "Submit Rating",
      message: `You're about to submit a ${rating}-star rating. Are you sure?`,
      action: () => submitRating(restaurant_id, transactionId),
    });
  };

  const handleVerifyClick = async (transactionId) => {
    setConfirmModal({
      show: true,
      title: "Verify Transaction",
      message: "Are you sure you want to verify this transaction?",
      action: async () => {
        try {
          await OrderService.verifyTransaction(transactionId);
          setPopup({
            show: true,
            type: "success",
            message: "Transaction has been verified successfully!",
          });
          fetchData();
        } catch (err) {
          console.error("Failed to verify:", err);
          setPopup({
            show: true,
            type: "error",
            message:
              err.response?.data?.message ||
              "Unable to verify this transaction. Please try again.",
          });
        }
      },
    });
  };

  const renderStars = (transactionId, isReadOnly = false) => {
    const currentRating = ratings[transactionId] || 0;
    const isLocked = submittedRatings.includes(transactionId);
    const size = "24px";

    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            onClick={() =>
              !isLocked &&
              !isReadOnly &&
              handleRatingClick(transactionId, i + 1)
            }
            style={{
              cursor: isLocked || isReadOnly ? "default" : "pointer",
              color: i < currentRating ? "#facc15" : "#d1d5db",
              fontSize: size,
              pointerEvents: isLocked || isReadOnly ? "none" : "auto",
              transition: "color 0.2s ease",
            }}
            className="hover:scale-110 transition-transform"
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID");
  };

  return (
    <div className="flex flex-col min-h-screen max-w-6xl mx-auto px-4 py-8">
      {/* Updated Popup Modal to match Cart.jsx style */}
      {popup.show && (
        <div className="fixed inset-0 bg-gray-600/30 flex justify-center items-center z-50">
          <div
            className={`bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center ${
              popup.type === "success"
                ? "border-green-500"
                : popup.type === "warning"
                ? "border-yellow-500"
                : "border-red-500"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-4 ${
                popup.type === "success"
                  ? "text-green-600"
                  : popup.type === "warning"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {popup.type === "success"
                ? "Success!"
                : popup.type === "warning"
                ? "Warning!"
                : "Error!"}
            </h2>
            <p className="mb-4">{popup.message}</p>
            <button
              onClick={() => setPopup({ ...popup, show: false })}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Updated Confirmation Modal to match Cart.jsx style */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() =>
              setConfirmModal({
                show: false,
                action: null,
                title: "",
                message: "",
              })
            }
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center border border-green-500">
            <h2 className="text-xl font-semibold mb-2 text-green-600">
              {confirmModal.title}
            </h2>
            <p className="mb-4">{confirmModal.message}</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() =>
                  setConfirmModal({
                    show: false,
                    action: null,
                    title: "",
                    message: "",
                  })
                }
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => {
                  confirmModal.action();
                  setConfirmModal({
                    show: false,
                    action: null,
                    title: "",
                    message: "",
                  });
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

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
                  // Restaurant view (table)
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
                                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer transition-colors"
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
                  // Regular user view (cards)
                  <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-4">
                      Waiting to be verified
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                      {status1.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl shadow-lg overflow-hidden p-4 transform transition-all hover:shadow-xl"
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
                                initiateRatingSubmission(
                                  item.restaurant.restaurant_id,
                                  item.transaction_id
                                )
                              }
                              className="mt-2 w-full bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 cursor-pointer transition-colors flex items-center justify-center"
                            >
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
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {completedTransactions.map((item, index) => (
                      <div
                        key={index}
                        className="bg-green-50 rounded-xl shadow-lg overflow-hidden p-4 border border-green-200 transform transition-all hover:border-green-300"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg truncate">
                            {item.name}
                          </h3>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            Completed
                          </span>
                        </div>
                        <img
                          src={item.food.photo}
                          alt={item.food.name}
                          className="w-full h-40 object-cover rounded-lg my-2"
                        />
                        <p className="mt-2 text-green-700 font-medium">
                          Total: Rp {item.total.toLocaleString("id-ID")}
                        </p>
                        <p className="text-sm text-green-600 mt-1">
                          Date: {formatDate(item.date)}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-green-600">
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
