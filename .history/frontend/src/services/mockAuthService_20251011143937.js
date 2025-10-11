// Mock auth service for when backend is not running
export const mockAuthService = {
  login: async (credentials) => {
    console.log('Using mock login service');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    return {
      accessToken: 'mock.jwt.token.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicGhvbmUiOiIwMTIzNDU2Nzg5Iiwicm9sZSI6InVzZXIifQ',
      refreshToken: 'mock.refresh.token'
    };
  },
  
  register: async (userInfo) => {
    console.log('Using mock register service');
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      success: true,
      message: 'Registration successful (mock)',
      user: {
        id: Math.random().toString(36).substring(7),
        username: userInfo.username,
        email: userInfo.email,
        phone: userInfo.phone,
        role: userInfo.role || 'user'
      }
    };
  },
  
  logout: async () => {
    console.log('Using mock logout service');
    return { success: true };
  }
};