import { database } from '../firebaseConfig';
import { serverTimestamp } from 'firebase/database';
import { ref, set, push, get, update, remove } from "firebase/database";

// Saving new list
export const saveList = async (userId: string, name: string, codes: number[]) => {
  const listsRef = ref(database, `users/${userId}/lists`);
  const newListRef = push(listsRef);
  
  await set(newListRef, {
    name,
    codes: codes || [],
    imageLinks: (codes || []).map(code => `https://http.dog/${code}.jpg`),
    createdAt: serverTimestamp(), 
    updatedAt: serverTimestamp()  
  });
  
  return { id: newListRef.key, name, codes: codes || [] };
};

// Get single list 
export const getListDetail = async (userId: string, listId: string) => {
  const listRef = ref(database, `users/${userId}/lists/${listId}`);
  const snapshot = await get(listRef);
  
  if (snapshot.exists()) {
    return { 
      id: listId, 
      ...snapshot.val(),
      codes: snapshot.val().codes || [] // Ensure codes array exists
    };
  }
  return null;
};

// Alias for getListDetail to maintain backward compatibility
export const getList = getListDetail;

// All lists of user
export const getUserLists = async (userId: string) => {
  const listsRef = ref(database, `users/${userId}/lists`);
  const snapshot = await get(listsRef);
  
  if (!snapshot.exists()) return [];

  const lists: any[] = [];
  snapshot.forEach((childSnapshot) => {
    const listData = childSnapshot.val();
    lists.push({
      id: childSnapshot.key,
      ...listData,
      codes: listData.codes || [],
      // Convert timestamp to Date
      createdAt: listData.createdAt ? new Date(listData.createdAt) : new Date(),
      updatedAt: listData.updatedAt ? new Date(listData.updatedAt) : new Date()
    });
  });
  
  return lists;
};

// Update existing list
export const updateList = async (userId: string, listId: string, updates: any) => {
  const listRef = ref(database, `users/${userId}/lists/${listId}`);
  await update(listRef, {
    ...updates,
    updatedAt: Date.now()
  });
};



// Adding codes to existing list
export const addCodesToList = async (userId: string, listId: string, codes: number[]) => {
  const listRef = ref(database, `users/${userId}/lists/${listId}`);
  const snapshot = await get(listRef);
  
  if (snapshot.exists()) {
    const currentData = snapshot.val();
    const currentCodes = currentData.codes || [];
    const updatedCodes = [...new Set([...currentCodes, ...codes])]; // Avoid duplicates
    const updatedImageLinks = updatedCodes.map(code => `https://http.dog/${code}.jpg`);
    
    await update(listRef, {
      codes: updatedCodes,
      imageLinks: updatedImageLinks,
      updatedAt: Date.now()
    });
  }
};

// Remove multiple codes from list (new function)
export const removeCodesFromList = async (userId: string, listId: string, codes: number[]) => {
  const listRef = ref(database, `users/${userId}/lists/${listId}`);
  const snapshot = await get(listRef);
  
  if (snapshot.exists()) {
    const currentData = snapshot.val();
    const currentCodes = currentData.codes || [];
    const updatedCodes = currentCodes.filter((c: number) => !codes.includes(c));
    const updatedImageLinks = updatedCodes.map((c: number) => `https://http.dog/${c}.jpg`);
    
    await update(listRef, {
      codes: updatedCodes,
      imageLinks: updatedImageLinks,
      updatedAt: Date.now()
    });
  }
};

// Remove single code from list (keeping your original function)
export const removeCodeFromList = async (userId: string, listId: string, code: number) => {
  await removeCodesFromList(userId, listId, [code]);
};

// Deleting a list
export const deleteList = async (userId: string, listId: string) => {
  const listRef = ref(database, `users/${userId}/lists/${listId}`);
  await remove(listRef);
};