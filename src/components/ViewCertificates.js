import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ConfirmModal from './ConfirmModal';

const ViewCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [certToDelete, setCertToDelete] = useState(null);

  useEffect(() => {
    const fetchUserAndCertificates = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError.message);
        return;
      }

      if (user) {
        setUserId(user.id);
        fetchCertificates(user.id);
      }
    };

    fetchUserAndCertificates();
  }, []);

  const fetchCertificates = async (uid) => {
    setLoading(true);

    const { data, error } = await supabase
      .from('certificate')
      .select('*')
      .eq('user_id', uid);

    if (error) {
      console.error('Error fetching certificates:', error.message);
      setLoading(false);
      return;
    }

    const certsWithUrls = await Promise.all(
      data.map(async (cert) => {
        const { data: urlData, error: urlError } = await supabase.storage
          .from('certificate')
          .getPublicUrl(cert.filename);

        if (urlError) {
          console.error('Error getting public URL:', urlError.message);
          return cert;
        }

        return { ...cert, url: urlData.publicUrl };
      })
    );

    setCertificates(certsWithUrls);
    setLoading(false);
  };

  const askToDelete = (cert) => {
    setCertToDelete(cert);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!certToDelete) return;

    const { id, filename } = certToDelete;

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('certificate')
      .remove([filename]);

    if (storageError) {
      alert("❌ Failed to delete from storage: " + storageError.message);
      console.error("Storage deletion error:", storageError);
      return;
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('certificate')
      .delete()
      .eq('id', id);

    if (dbError) {
      alert("❌ Failed to delete from database: " + dbError.message);
      console.error("DB deletion error:", dbError);
      return;
    }

    // Update UI
    setCertificates((prev) => prev.filter((c) => c.id !== id));
    setShowConfirm(false);
    setCertToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setCertToDelete(null);
  };

  return (
    <div className="view-container">
      <h2>Your Certificates</h2>

      {loading ? (
        <p>Loading certificates...</p>
      ) : certificates.length === 0 ? (
        <p>No certificates uploaded yet.</p>
      ) : (
        <div className="cert-grid">
          {certificates.map((cert) => (
            <div key={cert.id} className="cert-card">
              <iframe
                src={cert.url}
                title={cert.filename}
                className="cert-preview"
              ></iframe>
              <div className="cert-name">{cert.filename.split('/').pop()}</div>
              <div className="cert-actions">
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-btn"
                >
                  View
                </a>
                <button className="delete-btn" onClick={() => askToDelete(cert)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this certificate?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default ViewCertificates;

