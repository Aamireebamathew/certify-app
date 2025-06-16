import React from 'react';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="confirm" onClick={onConfirm}>Yes</button>
          <button className="cancel" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
