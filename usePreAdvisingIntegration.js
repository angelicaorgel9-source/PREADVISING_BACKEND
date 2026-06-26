import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getYearSummary,
  getStudents,
  getStudentDetails,
  getStudentRecords,
  generatePreAdvising,
} from "./api";

export const usePreAdvisingIntegration = () => {
  const [yearSummary, setYearSummary] = useState({});
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [genAve, setGenAve] = useState(null);
  const [recommendedSubjects, setRecommendedSubjects] = useState([]);
  const [semester, setSemester] = useState("1");
  const [schoolYear, setSchoolYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadYearSummaries = useCallback(async () => {
    try {
      setError(null);
      const years = [1, 2, 3, 4];
      const responses = await Promise.all(years.map((year) => getYearSummary(year)));
      const map = responses.reduce((acc, item) => {
        if (item && item.year_level != null) {
          acc[item.year_level] = item;
        }
        return acc;
      }, {});
      setYearSummary(map);
    } catch (err) {
      console.error("Failed to load year summaries", err);
      setError("Unable to load year summaries");
    }
  }, []);

  const loadStudentsForYear = useCallback(async (year) => {
    try {
      setError(null);
      setLoading(true);
      const students = await getStudents(year);
      setStudentList(students || []);
      setSelectedStudent(null);
      setGrades([]);
      setGenAve(null);
      setRecommendedSubjects([]);
    } catch (err) {
      console.error("Failed to load students", err);
      setError("Unable to load students for selected year");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStudentDetails = useCallback(async (student_no) => {
    if (!student_no) {
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const details = await getStudentDetails(student_no);
      const normalized = {
        ...details,
        section: details.status === "irregular" ? null : details.section,
      };
      setSelectedStudent(normalized);
      setRecommendedSubjects([]);
    } catch (err) {
      console.error("Failed to load student details", err);
      setError("Unable to load student details");
    } finally {
      setLoading(false);
    }
  }, []);

  const computeGenAve = useCallback((records) => {
    if (!Array.isArray(records) || records.length === 0) {
      return null;
    }

    const completedRecords = records.filter(
      (record) => record.status === "completed" || record.status === "credited"
    );

    if (completedRecords.length === 0) {
      return null;
    }

    const total = completedRecords.reduce((sum, record) => {
      const grade = Number(record.grade);
      return sum + (Number.isFinite(grade) ? grade : 0);
    }, 0);

    return total / completedRecords.length;
  }, []);

  const loadGrades = useCallback(
    async (student_no, semesterValue, schoolYearValue) => {
      if (!student_no || !semesterValue || !schoolYearValue) {
        setGrades([]);
        setGenAve(null);
        return;
      }

      try {
        setError(null);
        setLoading(true);
        const records = await getStudentRecords(student_no, semesterValue, schoolYearValue);
        setGrades(records || []);
        setGenAve(computeGenAve(records || []));
      } catch (err) {
        console.error("Failed to load student records", err);
        setError("Unable to load student grades");
        setGrades([]);
        setGenAve(null);
      } finally {
        setLoading(false);
      }
    },
    [computeGenAve]
  );

  const handleYearClick = useCallback(
    async (year) => {
      await loadStudentsForYear(year);
    },
    [loadStudentsForYear]
  );

  const handleStudentClick = useCallback(
    async (student_no) => {
      await loadStudentDetails(student_no);
    },
    [loadStudentDetails]
  );

  const handleSemesterChange = useCallback((value) => {
    setSemester(value);
  }, []);

  const handleSchoolYearChange = useCallback((value) => {
    setSchoolYear(value);
  }, []);

  const handleGeneratePreAdvising = useCallback(async () => {
    if (!selectedStudent) {
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const payload = {
        student_no: selectedStudent.student_no,
        year_level: selectedStudent.year_level,
        semester,
        status: selectedStudent.status,
      };
      const response = await generatePreAdvising(payload);
      setRecommendedSubjects(response.recommended_subjects || []);
    } catch (err) {
      console.error("Failed to generate pre-advising", err);
      setError("Unable to generate pre-advising recommendations");
      setRecommendedSubjects([]);
    } finally {
      setLoading(false);
    }
  }, [selectedStudent, semester]);

  const selectedStudentDetails = useMemo(() => {
    if (!selectedStudent) {
      return null;
    }

    const isIrregular = selectedStudent.status === "irregular";
    return {
      ...selectedStudent,
      section: isIrregular ? null : selectedStudent.section,
      statusLabel: isIrregular ? "Irregular Student" : selectedStudent.status,
    };
  }, [selectedStudent]);

  useEffect(() => {
    loadYearSummaries();
  }, [loadYearSummaries]);

  useEffect(() => {
    if (selectedStudent?.student_no) {
      loadGrades(selectedStudent.student_no, semester, schoolYear);
    }
  }, [selectedStudent?.student_no, semester, schoolYear, loadGrades]);

  return {
    yearSummary,
    studentList,
    selectedStudent: selectedStudentDetails,
    grades,
    genAve,
    recommendedSubjects,
    semester,
    schoolYear,
    loading,
    error,
    handleYearClick,
    handleStudentClick,
    handleSemesterChange,
    handleSchoolYearChange,
    handleGeneratePreAdvising,
  };
};
