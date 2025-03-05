import React, { useState, useRef, useEffect } from 'react';
import './DraggableModal.css';

function DraggableModal({ isOpen, onClose,stockvalue, children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const modalRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && modalRef.current) {
        const deltaX = e.clientX - dragStartPos.current.x;
        const deltaY = e.clientY - dragStartPos.current.y;

        setPosition((prevPosition) => ({
          x: prevPosition.x + deltaX,
          y: prevPosition.y + deltaY,
        }));

        dragStartPos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div
        ref={modalRef}
        className="modal-content"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onMouseDown={(e) => {
          setIsDragging(true);
          dragStartPos.current = { x: e.clientX, y: e.clientY };
        }}
      >
        <div className="modal-header" >
          <span className="close-button" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="modal-body">
          <form className="form">
            <div className="form-group">
              <input type="number" className="form-control" placeholder="Quantity"/>
            </div>
            <div className="form-group" style={{display:"flex",justifyContent:"right"}}>
              <button type="button" className="btn btn-primary btn-sm">Buy</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DraggableModal;