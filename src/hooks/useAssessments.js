import { useState, useEffect, useCallback } from 'react';
import { getAssessmentsBySubject, createAssessment, updateAssessment, deleteAssessment } from '../db/assessments';
import { useApp } from '../contexts/AppContext';

export function useAssessments(subjectId) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useApp();

  const refresh = useCallback(async () => {
    if (!subjectId) {
      setAssessments([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getAssessmentsBySubject(subjectId);
      setAssessments(data);
    } catch (error) {
      console.error('Failed to load assessments:', error);
      addToast('Failed to load assessments', 'error');
    } finally {
      setLoading(false);
    }
  }, [subjectId, addToast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = async (assessmentData) => {
    try {
      await createAssessment(assessmentData);
      await refresh();
      addToast('Assessment added', 'success');
      return true;
    } catch (error) {
      addToast(error.message || 'Failed to add assessment', 'error');
      return false;
    }
  };

  const update = async (id, updates) => {
    try {
      await updateAssessment(id, updates);
      await refresh();
      return true;
    } catch (error) {
      addToast(error.message || 'Failed to update assessment', 'error');
      return false;
    }
  };

  const remove = async (id) => {
    try {
      await deleteAssessment(id);
      await refresh();
      addToast('Assessment deleted', 'success');
      return true;
    } catch (error) {
      addToast(error.message || 'Failed to delete assessment', 'error');
      return false;
    }
  };

  return { assessments, loading, refresh, add, update, remove };
}
