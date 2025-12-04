import { useState, useCallback } from 'react'
import api from '@/api/axiosInterceptor'
import { toast } from 'sonner'

export const useUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState(null)

  const fetchUsers = useCallback(async (params = {}) => {
    try {
      setLoading(true)
      const response = await api.get('/users', { params })
      setUsers(response.data.data?.users || [])
      setPagination(response.data.data?.pagination || null)
    } catch (error) {
      toast.error('Failed to fetch users')
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUser = useCallback(async (id, updateData) => {
    try {
      setLoading(true)
      const response = await api.patch(`/users/${id}`, updateData)
      toast.success('User updated successfully')
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user._id === id ? { ...user, ...updateData } : user
      ))
      
      return response.data.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteUser = useCallback(async (id) => {
    try {
      setLoading(true)
      await api.delete(`/users/${id}`)
      toast.success('User deleted successfully')
      
      // Update local state
      setUsers(prev => prev.filter(user => user._id !== id))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    users,
    loading,
    pagination,
    fetchUsers,
    updateUser,
    deleteUser
  }
}