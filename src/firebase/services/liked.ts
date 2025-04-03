import { database } from "../firebaseConfig";
import { ref, set, onValue, off } from "firebase/database";

export const toggleLikeStatus = (userId: string, statusCode: number, isCurrentlyLiked: boolean): Promise<void> => {
  const likeRef = ref(database, `users/${userId}/likedDogs/${statusCode}`);
  return set(likeRef, isCurrentlyLiked ? null : true);
};

export const listenToUserLikes = (
  userId: string,
  callback: (likedStatusCodes: number[]) => void
): (() => void) => {
  const likesRef = ref(database, `users/${userId}/likedDogs`);
  
  const unsubscribe = onValue(likesRef, (snapshot) => {
    const data = snapshot.val();
    const likedCodes = data ? Object.keys(data).map(Number) : [];
    callback(likedCodes);
  });

  return () => off(likesRef, 'value', unsubscribe);
};