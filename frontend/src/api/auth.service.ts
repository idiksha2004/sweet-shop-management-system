// ... existing code ...

export const authService = {
  // ... existing methods ...

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<{ data: User }>('/auth/me');
    return response.data.data;
  },

  // ... existing methods ...
};