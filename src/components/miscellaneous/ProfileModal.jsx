import { User, Mail, X } from "lucide-react";

const ProfileModal = ({ user, children, isOpen, onClose }) => {
  if (!isOpen) return children;

  return (
    <>
      {children}
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{user.name}</h2>
            <button onClick={onClose}><X size={24} /></button>
          </div>
          <div className="modal-body">
            <img src={user.pic} alt={user.name} className="profile-pic" />
            <div className="info-item">
               <Mail size={20} />
               <span>{user.email}</span>
            </div>
            <div className="info-item">
               <User size={20} />
               <span>Available</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .modal-content {
          width: 400px;
          padding: 30px;
          border-radius: 20px;
          text-align: center;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }
        .modal-header h2 { font-size: 1.5rem; }
        .modal-header button { background: transparent; color: var(--text-secondary); }
        .profile-pic {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto 25px;
          border: 4px solid var(--primary-teal);
        }
        .info-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 15px;
          font-size: 1.1rem;
          color: var(--text-primary);
        }
      `}</style>
    </>
  );
};

export default ProfileModal;
