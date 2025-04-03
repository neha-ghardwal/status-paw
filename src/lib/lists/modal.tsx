import React, { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { List } from './ListsPage';
import { updateList } from '../../firebase/services/lists';
import { useAuth } from '../auth/authProvider';
import { FaPaw } from 'react-icons/fa';

interface ViewModalProps {
  list: List;
  onClose: () => void;
  onUpdateList: (updatedList: List) => void;
}

const ViewModal: React.FC<ViewModalProps> = ({ list, onClose, onUpdateList }) => {
  const { user } = useAuth();
  const [localList, setLocalList] = useState<List>(list);

  useEffect(() => {
    setLocalList(list);
  }, [list]);

  const handleDeleteImage = async (index: number) => {
    if (!user?.uid) return;

    const newImageLinks = [...localList.imageLinks];
    const newCodes = [...localList.codes];

    newImageLinks.splice(index, 1);
    newCodes.splice(index, 1);

    const updatedList = {
      ...localList,
      imageLinks: newImageLinks,
      codes: newCodes,
      updatedAt: Date.now(),
    };

    setLocalList(updatedList);
    onUpdateList(updatedList);

    try {
      // Firebase (letting the service handle the timestamp)
      await updateList(user.uid, localList.id, {
        imageLinks: newImageLinks,
        codes: newCodes,
      });
      toast.success('Image removed from list');
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-red-100 via-white to-pink-200 p-6 rounded-xl w-full max-w-3xl shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex flex-row gap-2 items-center">
              <FaPaw className="w-5 h-5" />
              <h2 className="text-xl font-bold text-gray-800">{localList.name}</h2>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Created:{" "}
              {new Date(localList.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 p-2 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="flex-grow overflow-y-auto pr-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {localList.imageLinks.map((image, index) => (
              <div key={`${list.id}-${index}-${list.codes[index]}`} className="flex flex-col">
                <div className="aspect-square relative group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                  <img
                    src={image}
                    alt={`HTTP ${list.codes[index]} status dog`}
                    className="w-full h-full object-cover border-b border-gray-200"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(index);
                    }}
                    className="absolute top-1 right-1 p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-sm"
                    aria-label={`Delete HTTP ${list.codes[index]} image`}
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg shadow">
                  <div className="text-sm font-semibold text-red-800">
                    Response Code: {list.codes[index]}
                  </div>
                  <div className="text-xs text-gray-400 font-mono truncate">
                    Image - [{image.replace('https://', '')}]
                  </div>
                </div>
              </div>
            ))}

            {/* Empty state */}
            {localList.imageLinks.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No items in this list yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Close button */}
        <div className="pt-6 mt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full px-5 py-2.5 bg-gray-200 hover:bg-gray-300 hover:border-2 hover:border-gray-500 text-gray-700 rounded-lg transition-colors duration-200 font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
