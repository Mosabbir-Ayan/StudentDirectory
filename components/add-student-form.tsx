import { useStudents } from "@/context/students-context";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import type { Student } from "../data/students";
import FormField from "./form-field";

interface FormData {
  name: string;
  studentId: string;
  department: string;
  bio: string;
  skillsText: string;
}

interface FormErrors {
  name?: string;
  studentId?: string;
  department?: string;
  bio?: string;
}

function validateForm(data: FormData, students: Student[]): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Name is required.";
  } else if (data.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters.";
  }

  const studentId = data.studentId.trim();
  const idPattern = /^\d{2}-\d{5}-\d$/;

  if (!studentId) {
    errors.studentId = "Student ID is required.";
  } else if (!idPattern.test(studentId)) {
    errors.studentId = "Use the format NN-NNNNN-N, e.g. 22-12345-1.";
  } else if (
    students.some(
      (student) =>
        student.studentId.trim().toLowerCase() === studentId.toLowerCase()
    )
  ) {
    errors.studentId = "Student ID already exists.";
  }

  if (!data.department.trim()) {
    errors.department = "Department is required.";
  }

  if (!data.bio.trim()) {
    errors.bio = "Bio is required.";
  } else if (data.bio.trim().length < 10) {
    errors.bio = "Bio must be at least 10 characters.";
  }

  return errors;
}

export default function AddStudentForm() {
  const { students, dispatch } = useStudents();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    studentId: "",
    department: "",
    bio: "",
    skillsText: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<FormData | null>(
    null
  );

  const currentErrors = validateForm(formData, students);
  const isSubmitting = pendingSubmission !== null;
  const isFormValid = Object.keys(currentErrors).length === 0;

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const markTouched = (field: keyof FormData) => {
    setTouched((previous) => ({ ...previous, [field]: true }));
  };

  const getFieldError = (field: keyof FormErrors) =>
    touched[field] || submitAttempted ? currentErrors[field] : undefined;

  const handleSubmitPress = () => {
    setSubmitAttempted(true);

    setTouched({
      name: true,
      studentId: true,
      department: true,
      bio: true,
      skillsText: true,
    });

    const errors = validateForm(formData, students);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setPendingSubmission({ ...formData });
  };

  useEffect(() => {
    if (!pendingSubmission) {
      return;
    }

    const timeoutId = setTimeout(() => {
      const newStudent: Student = {
        id: `added-${Date.now()}`,
        name: pendingSubmission.name.trim(),
        studentId: pendingSubmission.studentId.trim(),
        department: pendingSubmission.department.trim(),
        bio: pendingSubmission.bio.trim(),
        skills: pendingSubmission.skillsText
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        avatarUrl: "",
      };

      dispatch({ type: "ADD_STUDENT", payload: newStudent });
      setPendingSubmission(null);

      if (Platform.OS === "web") {
        router.back();
      } else {
        Alert.alert("Success", "Student added to the directory.", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [pendingSubmission, dispatch]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Join the Directory</Text>

      <Text style={styles.subheading}>
        Fill in your details below to add yourself to StudentDirectory.
      </Text>

      <FormField
        label="Full Name"
        value={formData.name}
        onChangeText={(value) => updateField("name", value)}
        onBlur={() => markTouched("name")}
        placeholder="e.g. Ashraful Haque"
        error={getFieldError("name")}
      />

      <FormField
        label="Student ID"
        value={formData.studentId}
        onChangeText={(value) => updateField("studentId", value)}
        onBlur={() => markTouched("studentId")}
        placeholder="e.g. 22-12345-1"
        autoCapitalize="none"
        error={getFieldError("studentId")}
      />

      <FormField
        label="Department"
        value={formData.department}
        onChangeText={(value) => updateField("department", value)}
        onBlur={() => markTouched("department")}
        placeholder="e.g. Computer Science"
        error={getFieldError("department")}
      />

      <FormField
        label="Bio"
        value={formData.bio}
        onChangeText={(value) => updateField("bio", value)}
        onBlur={() => markTouched("bio")}
        placeholder="Write at least 10 characters about yourself"
        multiline
        error={getFieldError("bio")}
      />

      <FormField
        label="Skills (comma-separated)"
        value={formData.skillsText}
        onChangeText={(value) => updateField("skillsText", value)}
        onBlur={() => markTouched("skillsText")}
        placeholder="React Native, TypeScript, Figma"
        autoCapitalize="none"
      />

      <Pressable
        style={[
          styles.button,
          (!isFormValid || isSubmitting) && styles.buttonDisabled,
        ]}
        onPress={handleSubmitPress}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Join Directory</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0D1F4E",
    marginBottom: 6,
  },
  subheading: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 24,
    lineHeight: 19,
  },
  button: {
    backgroundColor: "#0D9488",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#94A3B8",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});