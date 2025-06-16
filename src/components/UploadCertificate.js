import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const UploadCertificate = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        navigate('/login');
      }
    };
    getUser();
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setUploadMessage('');
    } else {
      setUploadMessage("❌ Please upload a valid PDF file.");
      setPdfFile(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!pdfFile || !userId) return;

    setUploading(true);
    const filePath = `${userId}/${Date.now()}-${pdfFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from('certificate')
      .upload(filePath, pdfFile);

    if (uploadError) {
      setUploadMessage('❌ Upload failed: ' + uploadError.message);
    } else {
      const { error: insertError } = await supabase.from('certificate').insert([
        { user_id: userId, filename: filePath }
      ]);

      if (insertError) {
        setUploadMessage('❌ Upload succeeded, but database insert failed.');
      } else {
        setUploadMessage('✅ Upload successful!');
        setPdfFile(null);
      }
    }

    setUploading(false);

    // Clear message after 5 seconds
    setTimeout(() => setUploadMessage(''), 5000);
  };

  return (
    <div className="upload-container">
      <h2>Upload Certificate (PDF)</h2>
      <form onSubmit={handleUpload} className="upload-form">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="file-input"
        />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        {uploadMessage && (
          <p className={uploadMessage.startsWith('✅') ? 'success' : 'error'}>
            {uploadMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default UploadCertificate;
