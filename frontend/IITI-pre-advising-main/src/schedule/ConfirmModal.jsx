import Trashbin from "../assets/photo/Trashbin.png";

const ConfirmModal = ({ show, onCancel, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
      <div className="bg-white p-6 rounded shadow-lg w-165 text-center space-y-4">
        <img src={Trashbin} className="mx-auto" />
        <h2 className="text-lg mb-4">
          Are you sure do you want to clear the schedule?
        </h2>

        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
