import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux/Store';
import { updateUserProfile } from '../../redux/thunks/UserThunks';
import { editProfileSchema } from '../../utils/validations/EditProfileValidation';
import { FaCamera } from 'react-icons/fa';
import { z } from 'zod';
import { EditProfileProps } from '@/types/UserTypes';



const EditProfile: React.FC<EditProfileProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { user, loading } = useSelector((state: RootState) => ({
    user: state.auth.user,
    loading: state.auth.loading,
  }));

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    github: '',
    linkedin: '',
    profileImage: null as File | null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        profileImage: null,
      });
      setPreviewImage(user.profileImage || null);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setIsDirty(true);
    
    // Real-time validation
    try {
      editProfileSchema.parse({ ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: '' }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [name]: error.errors[0].message,
        }));
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setFormData({ ...formData, profileImage: file });
      setIsDirty(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setErrors((prev) => ({ ...prev, profileImage: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = editProfileSchema.parse({
        ...formData,
        profileImage: formData.profileImage || null,
      });
      
      setErrors({});

      await dispatch(updateUserProfile({
        fullName: validatedData.fullName,
        github: validatedData.github || undefined,
        linkedin: validatedData.linkedin || undefined,
        profileImage: formData.profileImage || undefined,
        
      })).unwrap();
      
      

      setIsDirty(false);
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: "Failed to update profile" });
      }
    }
  };

  const handleClose = () => {
    if (isDirty && !confirm("You have unsaved changes. Are you sure you want to close?")) {
      return;
    }
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        
        {loading && <div className="text-center mb-4">Updating profile...</div>}
        {errors.general && <div className="text-red-500 mb-4">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-xl font-bold">
                      {formData.fullName ? formData.fullName.charAt(0) : ''}
                    </span>
                  </div>
                )}
              </div>
              <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              >
                <FaCamera size={14} />
              </label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              {errors.profileImage && (
                <p className="text-red-500 text-sm mt-1">{errors.profileImage}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-background border rounded-md ${
                errors.fullName ? 'border-red-500' : 'border-input'
              }`}
              placeholder="Your Name"
              required
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-input rounded-md"
              placeholder="Email Address"
              disabled
            />
          </div>

          <div className="mb-4">
            <label htmlFor="github" className="block text-sm font-medium mb-1">
              GitHub
            </label>
            <input
              type="url"
              id="github"
              name="github"
              value={formData.github}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-background border rounded-md ${
                errors.github ? 'border-red-500' : 'border-input'
              }`}
              placeholder="GitHub URL"
            />
            {errors.github && (
              <p className="text-red-500 text-sm mt-1">{errors.github}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="linkedin" className="block text-sm font-medium mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-background border rounded-md ${
                errors.linkedin ? 'border-red-500' : 'border-input'
              }`}
              placeholder="LinkedIn URL"
            />
            {errors.linkedin && (
              <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-border rounded-md text-foreground"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;