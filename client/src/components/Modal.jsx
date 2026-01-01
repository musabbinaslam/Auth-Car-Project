import React from 'react';

const Modal = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--bg-card)',
                padding: '2rem',
                borderRadius: '0.5rem',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative'
            }} onClick={e => e.stopPropagation()} className="modal-content">
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: 'var(--text-color)'
                    }}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
