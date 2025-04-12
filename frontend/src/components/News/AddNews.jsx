import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Navbar from '../Navbar';


const AddNews = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'image') {
      setImages(files);
    } else if (type === 'video') {
      setVideos(files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append('title', formData.title);
    formPayload.append('content', formData.content);
    formPayload.append('category', formData.category);
    formPayload.append('author', '67700b196a349353e3697a3d'); // Replace with actual ID

    // Only append files if they exist
    if (images.length > 0) {
      images.forEach((img) => formPayload.append('images', img));
    }

    if (videos.length > 0) {
      videos.forEach((vid) => formPayload.append('videos', vid));
    }

    try {
      const response = await axios.post('http://localhost:5000/news/add', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('News submitted successfully!');
      setFormData({ title: '', content: '', category: '' });
      setImages([]);
      setVideos([]);
    } catch (error) {
      setMessage('Submission failed. Check the console.');
      console.error('Error submitting news:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-6">
        <h2 className="text-2xl font-semibold mb-4">Submit News</h2>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">

          <input
            type="text"
            name="title"
            placeholder="Title"
            className="w-full p-3 border rounded-xl"
            value={formData.title}
            onChange={handleChange}
            required
          />

          {/* <textarea
          name="content"
          placeholder="Content"
          className="w-full p-3 border rounded-xl"
          rows="5"
          value={formData.content}
          onChange={handleChange}
          required
          /> */}
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            className="bg-white rounded-xl"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            className="w-full p-3 border rounded-xl"
            value={formData.category}
            onChange={handleChange}
            required
          />

          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-medium">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'image')}
              className="block w-full"
            />
          </div>

          {/* Video Upload */}
          <div>
            <label className="block mb-1 font-medium">Upload Videos</label>
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => handleFileChange(e, 'video')}
              className="block w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
          >
            Submit News
          </button>

          {message && <p className="text-center text-sm text-blue-600">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddNews;
