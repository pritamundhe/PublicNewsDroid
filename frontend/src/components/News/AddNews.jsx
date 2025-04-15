import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Navbar from '../Navbar';


const AddNews = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: '',
  });

  const userId = localStorage.getItem("userId");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    const formPayload = new FormData();
    formPayload.append('title', formData.title);
    formPayload.append('content', formData.content);
    formPayload.append('summary', formData.summary);
    formPayload.append('category', formData.category);
    formPayload.append('author', userId);

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
      setFormData({ title: '', content: '', category: '', summary: '' });
      setImages([]);
      setVideos([]);
    } catch (error) {
      setMessage('Submission failed. Check the console.');
      console.error('Error submitting news:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div >
      <Navbar />
      <div className='bg-gray-100 min-h-full p-8'>
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl  pb-10">
          <h2 className="text-2xl font-semibold mb-4">Submit News</h2>
          {loading ? (
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>

          ) :
            (
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
                <input
                  type="Summary"
                  name="summary"
                  placeholder="Summary"
                  className="w-full p-3 border rounded-xl"
                  value={formData.summary}
                  onChange={handleChange}
                  required
                />

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
            )
          }

        </div>
      </div>
    </div>
  );
};

export default AddNews;
