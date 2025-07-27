import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../store';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', bussinessName: '' });
  const [photo, setPhoto] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const fileInputRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:8000/api/auth/profile', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setForm({
            name: data.user.name || '',
            phone: data.user.phone || '',
            address: data.user.address || '',
            bussinessName: data.user.bussinessName || '',
          });
        } else {
          setError('Profile not found');
        }
      } catch (err) {
        setError('Error fetching profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      formData.append('address', form.address);
      if (user.role === 'seller') {
        formData.append('bussinessName', form.bussinessName);
      }
      if (photo) {
        formData.append('profilePhoto', photo);
      }
      const res = await fetch('http://localhost:8000/api/auth/profile', {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setEditMode(false);
        setUpdateSuccess(true);
        dispatch(loginAction(data.user));
      } else {
        setUpdateError(data.message || 'Update failed');
      }
    } catch (err) {
      setUpdateError('Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-emerald-900 to-black py-12 px-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-emerald-400/30 relative">
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <img
            src={photo ? URL.createObjectURL(photo) : user.profilePhoto}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-emerald-400 shadow-xl object-cover bg-white"
          />
          {editMode && (
            <button
              className="absolute bottom-2 right-2 bg-emerald-600 text-white rounded-full p-2 shadow-lg hover:bg-emerald-700 focus:outline-none"
              onClick={() => fileInputRef.current.click()}
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3z" />
              </svg>
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handlePhotoChange}
          />
        </div>
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-extrabold text-white drop-shadow-lg mb-2">{user.name}</h2>
          <div className="text-lg text-emerald-200 mb-4">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
          {!editMode ? (
            <>
              <div className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
                <div className="bg-white/20 rounded-xl p-6 shadow-lg border border-emerald-200/20 flex-1 min-w-[220px]">
                  <div className="text-xs text-emerald-300 uppercase tracking-widest mb-1">Email</div>
                  <div className="text-lg text-white break-all">{user.email}</div>
                </div>
                {user.bussinessName && (
                  <div className="bg-white/20 rounded-xl p-6 shadow-lg border border-emerald-200/20 flex-1 min-w-[220px]">
                    <div className="text-xs text-emerald-300 uppercase tracking-widest mb-1">Business Name</div>
                    <div className="text-lg text-white">{user.bussinessName}</div>
                  </div>
                )}
              </div>
              <div className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
                {user.phone && (
                  <div className="bg-white/20 rounded-xl p-6 shadow-lg border border-emerald-200/20 flex-1 min-w-[220px]">
                    <div className="text-xs text-emerald-300 uppercase tracking-widest mb-1">Phone</div>
                    <div className="text-lg text-white">{user.phone}</div>
                  </div>
                )}
                {user.address && (
                  <div className="bg-white/20 rounded-xl p-6 shadow-lg border border-emerald-200/20 flex-1 min-w-[220px]">
                    <div className="text-xs text-emerald-300 uppercase tracking-widest mb-1">Address</div>
                    <div className="text-lg text-white">{user.address}</div>
                  </div>
                )}
              </div>
              <button
                className="mt-8 px-8 py-3 bg-gradient-to-tr from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all text-lg"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleUpdate}>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-sm text-emerald-200 mb-1 text-left">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white/80 focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-900"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-emerald-200 mb-1 text-left">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white/80 focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-sm text-emerald-200 mb-1 text-left">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white/80 focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-900"
                  />
                </div>
                {user.role === 'seller' && (
                  <div className="flex-1">
                    <label className="block text-sm text-emerald-200 mb-1 text-left">Business Name</label>
                    <input
                      type="text"
                      name="bussinessName"
                      value={form.bussinessName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white/80 focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-900"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 mt-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-tr from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all text-lg disabled:opacity-60"
                  disabled={updateLoading}
                >
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl shadow-lg hover:bg-gray-300 transition-all text-lg"
                  onClick={() => setEditMode(false)}
                  disabled={updateLoading}
                >
                  Cancel
                </button>
              </div>
              {updateError && <div className="mt-4 text-red-400">{updateError}</div>}
              {updateSuccess && <div className="mt-4 text-green-400">Profile updated successfully!</div>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 