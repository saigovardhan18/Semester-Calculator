import { useState, useEffect, useCallback } from 'react';
import { getSubjectsBySemester, createSubject, updateSubject, deleteSubject } from '../db/subjects';
import { useApp } from '../contexts/AppContext';

export function useSubjects(semesterId) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useApp();

  const refresh = useCallback(async () => {
    if (!semesterId) {
      setSubjects([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getSubjectsBySemester(semesterId);
      setSubjects(data);
    } catch (error) {
      console.error('Failed to load subjects:', error);
      addToast('Failed to load subjects', 'error');
    } finally {
      setLoading(false);
    }
  }, [semesterId, addToast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = async (subjectData) => {
    try {
      await createSubject({ ...subjectData, semesterId });
      await refresh();
      addToast('Subject added successfully', 'success');
      return true;
    } catch (error) {
      addToast(error.message || 'Failed to add subject', 'error');
      return false;
    }
  };

  const update = async (id, updates) => {
    try {
      await updateSubject(id, updates);
      await refresh();
      addToast('Subject updated', 'success');
      return true;
    } catch (error) {
      addToast(error.message || 'Failed to update subject', 'error');
      return false;
    }
  };

  const remove = async (id) => {
    try {
      await deleteSubject(id);
      await refresh();
      addToast('Subject deleted', 'success');
      return true;
    } catch (error) {
      addToast(error.message || 'Failed to delete subject', 'error');
      return false;
    }
  };

  return { subjects, loading, refresh, add, update, remove };
}
