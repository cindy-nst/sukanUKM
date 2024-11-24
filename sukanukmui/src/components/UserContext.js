import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    // Ensure we're storing the complete user data including role and details
    const userToStore = {
      ...userData,
      role: userData.role,
      details: userData.details
    };

    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Add a helper function to check user role
  const isStudent = () => user?.role === 'Student';
  const isStaff = () => user?.role === 'Staff';

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout,
      isStudent,
      isStaff
    }}>
      {children}
    </UserContext.Provider>
  );
};
