
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import NavTabs from '@/components/NavTabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || 'John',
    lastName: user?.name?.split(' ')[1] || 'Doe',
    email: user?.email || 'john.doe@example.com',
    bio: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the profile information
    alert('Profile updated successfully!');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-white flex">
      <NavTabs />
      
      <main className="flex-1 pl-64">
        <div className="max-w-4xl mx-auto px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white border rounded-lg p-8 mb-8"
          >
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4 bg-gray-100 text-gray-600 text-2xl">
                <AvatarFallback>{getInitials(formData.firstName, formData.lastName)}</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-semibold">{`${formData.firstName} ${formData.lastName}`}</h1>
              <p className="text-gray-500">{formData.email}</p>
            </div>
            
            <div className="flex justify-center space-x-4 mb-6">
              <Button variant="outline" onClick={() => navigate('/edit-profile')}>
                Edit Profile
              </Button>
              <Button variant="default" onClick={() => navigate('/certificates')}>
                View Certificates
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="border rounded-lg p-4">
                <h2 className="text-4xl font-bold mb-1">2</h2>
                <p className="text-gray-500">Courses</p>
              </div>
              <div className="border rounded-lg p-4">
                <h2 className="text-4xl font-bold mb-1">58%</h2>
                <p className="text-gray-500">Completion</p>
              </div>
              <div className="border rounded-lg p-4">
                <h2 className="text-4xl font-bold mb-1">0</h2>
                <p className="text-gray-500">Certificates</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white border rounded-lg p-8"
          >
            <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="bio" className="block text-sm font-medium">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                />
              </div>
              
              <div>
                <Button type="submit" className="w-full sm:w-auto">
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
