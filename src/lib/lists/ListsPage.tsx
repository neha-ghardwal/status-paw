import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
import { getUserLists, deleteList, updateList, saveList } from '../../firebase/services/lists';
import { useAuth } from '../auth/authProvider';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiChevronRight } from 'react-icons/fi';
import Navbar from '../navbar';
import LoadingSpinner from '../../components/ui/loading';
import ViewModal from './modal';

const pastelColors = [
  'hsl(0, 80%, 85%)',    // Red
  'hsl(30, 80%, 85%)',   // Orange
  'hsl(60, 80%, 85%)',   // Yellow
  'hsl(120, 80%, 85%)',  // Green
  'hsl(180, 80%, 85%)',  // Teal
  'hsl(240, 80%, 85%)',  // Blue
  'hsl(270, 80%, 85%)',  // Purple
  'hsl(330, 80%, 85%)',  // Pink
];

export interface List {
  id: string;
  name: string;
  codes: number[];
  createdAt: number;
  imageLinks: string[];
}

const ListsPage: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [newListName, setNewListName] = useState('');
  const [deleteListId, setDeleteListId] = useState<string | null>(null);
  const [deleteListName, setDeleteListName] = useState<string>('');
  const [selectedListForView, setSelectedListForView] = useState<List | null>(null);
  const { user } = useAuth();
  // const navigate = useNavigate();

  const filteredLists = useMemo(() => {
    if (!filter.trim()) return lists;
    const searchTerm = filter.toLowerCase();
    return lists.filter(list => list.name.toLowerCase().includes(searchTerm));
  }, [lists, filter]);

  useEffect(() => {
    const fetchLists = async () => {
      if (!user?.uid) return;
      
      try {
        setLoading(true);
        const userLists = await getUserLists(user.uid);
        setLists(userLists);
      } catch (error) {
        toast.error('Failed to load lists');
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [user?.uid]);

  const handleOpenEditModal = (list: List) => {
    setSelectedList(list);
    setEditName(list.name);
    setIsEditModalOpen(true);
  };

  const handleUpdateList = async () => {
    if (!selectedList || !editName.trim()) return;
    
    try {
      await updateList(user?.uid || '', selectedList.id, { name: editName });
      setLists(lists.map(list => list.id === selectedList.id ? { ...list, name: editName } : list));
      toast.success('List updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('Failed to update list');
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim() || !user?.uid) return;
    
    try {
      await saveList(user.uid, newListName, []);
      toast.success(`List "${newListName}" created successfully!`);
      setNewListName('');
      setIsCreateModalOpen(false);
      const userLists = await getUserLists(user.uid);
      setLists(userLists);
    } catch (error) {
      toast.error('Failed to create list');
    }
  };

  const handleDeleteClick = (listId: string, listName: string) => {
    setDeleteListId(listId);
    setDeleteListName(listName);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteListId || !user?.uid) return;
    
    try {
      await deleteList(user.uid, deleteListId);
      setLists(lists.filter(list => list.id !== deleteListId));
      toast.success('List deleted successfully');
    } catch (error) {
      toast.error('Failed to delete list');
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteListId(null);
      setDeleteListName('');
    }
  };

  const getListColor = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return pastelColors[hash % pastelColors.length];
  };

  const handleViewList = (list: List) => {
    setSelectedListForView(list);
    setIsViewModalOpen(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 max-w-9xl mx-auto min-h-screen">
      <Navbar filter={filter} setFilter={setFilter} page="lists" />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Lists</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <FiPlus className="text-lg" /> Create New List
        </button>
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No lists yet</h3>
            <p className="text-gray-500 mb-6">Create your first list to organize your favorite HTTP status dogs</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Create Your First List
            </button>
          </div>
        </div>
      ) : filteredLists.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No matches found</h3>
            <p className="text-gray-500 mb-6">No lists match "{filter}"</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLists.map((list) => (
            <div
              key={list.id}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all flex flex-col"
              style={{ 
                minHeight: '250px',
                backgroundColor: getListColor(list.id) 
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="pr-2">
                  <h2 className="text-xl font-semibold text-gray-800 truncate">{list.name}</h2>
                  <p className="text-xs text-gray-600 mt-1">
                    Created: {new Date(list.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEditModal(list)}
                    className="text-gray-500 hover:text-blue-600 p-1 transition-colors"
                    title="Edit list"
                  >
                    <FiEdit2 className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(list.id, list.name)}
                    className="text-gray-500 hover:text-red-600 p-1 transition-colors"
                    title="Delete list"
                  >
                    <FiTrash2 className="text-lg" />
                  </button>
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {(list.imageLinks || []).slice(0, 6).map((image, index) => (
                    <div key={index} className="aspect-square">
                      <img
                        src={image}
                        alt={`HTTP ${list.codes[index]}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  ))}
                  {list.codes.length === 0 && (
                    <div className="col-span-3 flex items-center justify-center h-full">
                      <p className="text-gray-400 text-sm">No items yet</p>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => list.codes.length > 0 && handleViewList(list)}
                disabled={list.codes.length === 0}
                className={`w-full mt-auto py-2 px-4 rounded-lg text-sm flex items-center justify-between transition-colors ${
                  list.codes.length === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span>
                  {list.codes.length > 0
                    ? `View ${list.codes.length} items`
                    : 'Add items from home'}
                </span>
                <FiChevronRight className="text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit List Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit List Name</h2>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateList}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create List Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Create New List</h2>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Enter list name"
              className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && newListName.trim() && handleCreateList()}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateList}
                className={`px-5 py-2 text-white rounded-lg transition-colors ${
                  newListName.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!newListName.trim()}
              >
                Create List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Delete List</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">"{deleteListName}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteListId(null);
                  setDeleteListName('');
                }}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View List Modal */}
      {isViewModalOpen && selectedListForView && (
          <ViewModal
            list={selectedListForView}
            onClose={() => setIsViewModalOpen(false)}
            onUpdateList={(updatedList) => {
              setLists(lists.map(list => 
                list.id === updatedList.id ? updatedList : list
              ));
            }}
          />
        )}
        </div>
        );
      };

export default ListsPage;
