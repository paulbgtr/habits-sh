import React from "react";
import { Modal } from "./Modal";

interface Props {
  label?: React.ReactNode;
  description?: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<Props> = ({
  label,
  description,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal className="min-h-fit" onClose={onCancel}>
      <div className="text-center text-xl font-bold sm:px-8">
        {label || "Are you sure?"}
      </div>

      <div className="text-light-gray">{description}</div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          className="rounded-md bg-white px-4 py-1 font-bold text-black duration-100 hover:bg-opacity-80"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          className="rounded-md bg-red-500 px-4 py-1 font-bold duration-100 hover:bg-opacity-80"
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};
