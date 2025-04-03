import React, { useState, useEffect } from "react";
import { listenToUserLikes, toggleLikeStatus } from "../../firebase/services/liked";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../auth/authProvider";
import LoadingSpinner from "../../components/ui/loading";
import Navbar from "../navbar";

const LikedDogs: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [likedDogs, setLikedDogs] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = listenToUserLikes(user.uid, (codes) => {
      setLikedDogs(codes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleUnlike = async (code: number) => {
    if (!user?.uid) return;
    
    try {
      await toggleLikeStatus(user.uid, code, true);
    } catch (error) {
      console.error("Failed to unlike dog:", error);
      // Optionally show error to user
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Navbar filter={filter} setFilter={setFilter} page="favorites" />
      <h1 className="text-4xl font-bold text-center mb-6 underline underline-offset-2 decoration-8 decoration-blue-200">
        Your Liked Status Dogs
      </h1>

      {likedDogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">You haven't liked any dogs yet</p>
          <p className="text-gray-500 mt-2">Like some dogs from the home page to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {likedDogs.map((code) => (
            <div
              key={code}
              className="flex flex-col items-center shadow-lg p-4 rounded-lg hover:shadow-xl transition-shadow"
            >
              <img
                src={`https://http.dog/${code}.jpg`}
                alt={`HTTP Status ${code}`}
                className="w-full h-auto rounded-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Image+Not+Found';
                }}
              />
              <div className="flex items-center justify-between w-full mt-2">
                <span className="text-lg font-semibold">Status {code}</span>
                <button
                  onClick={() => handleUnlike(code)}
                  aria-label="Remove like"
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <FaHeart className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedDogs;