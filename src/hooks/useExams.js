import { useState, useEffect, useCallback } from 'react';
import { getExamsBySemester, getUpcomingExams, createExam, updateExam, deleteExam } from '../db/exams';
import { useApp } from '../contexts/AppContext';

export function useExams(semesterId) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useApp();

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = semesterId 
        ? await getExamsBySemester(semesterId)
        : await getUpcomingExams();
      setExams(data);
    } catch (error) {
      console.error('Failed to load exams:', error);
      addToast('Failed to load exams', 'error');
    } finally {
      setLoading(false);
    }
  }, [semesterId, addToast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = async (examData) => {
    try {
      await createExam(examData);
      await refresh();
      addToast('Exam added', 'success');
      return true;
    } catch (error) {
      addToast(error.message || 'Failed to add exam', 'error');
      return false;
    }
  };

  const update = async (id, updates) => {
    try {
      await updateExam(id, updates);
      await refresh();
      addToast('Exam updated', 'success');
      return true;
    } catch (error) {
      addToast(error.message || 'Failed to update exam', 'error');
      return false;
    }
  };

  const remove = async (id) => {
    try {
      await deleteExam(id);
      await refresh();
      addToast('Exam deleted', 'success');
      return true;
    } catch (error) {
      addToast(error.message || 'Failed to delete exam', 'error');
      return false;
    }
  };

  return { exams, loading, refresh, add, update, remove };
}
