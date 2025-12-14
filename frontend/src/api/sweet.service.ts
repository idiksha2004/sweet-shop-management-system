// ... existing code ...

export const sweetService = {
  // ... existing methods ...

  updateSweet: async (
    id: string,
    data: Partial<Sweet>
  ): Promise<Sweet> => {
    const response = await apiClient.put<{ data: Sweet }>(`/sweets/${id}`, data);
    return response.data.data;
  },

  deleteSweet: async (id: string): Promise<void> => {
    await apiClient.delete(`/sweets/${id}`);
  },

  // ... existing methods ...
};