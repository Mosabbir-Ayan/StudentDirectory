import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useStudents } from "../context/students-context";
import { STUDENTS, type Student } from "../data/students";

interface StudentDetailProps {
  student: Student;
}

export default function StudentDetail({ student }: StudentDetailProps) {
  const { dispatch } = useStudents();

  const isOriginalStudent = STUDENTS.some(
    (original) => original.id === student.id
  );

  const handleRemove = () => {
    if (isOriginalStudent) {
      return;
    }

    const removeStudent = () => {
      dispatch({
        type: "REMOVE_STUDENT",
        payload: student.id,
      });
    };

    if (Platform.OS === "web") {
      if (globalThis.confirm(`Remove ${student.name} from the directory?`)) {
        removeStudent();
      }
      return;
    }

    Alert.alert(
      "Remove Student",
      `Remove ${student.name} from the directory?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: removeStudent,
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      {student.avatarUrl ? (
        <Image source={{ uri: student.avatarUrl }} style={styles.avatar} />
      ) : null}

      <Text style={styles.name}>{student.name}</Text>
      <Text style={styles.detail}>Student ID: {student.studentId}</Text>
      <Text style={styles.detail}>Department: {student.department}</Text>
      <Text style={styles.bio}>{student.bio}</Text>

      {student.skills.length > 0 ? (
        <View style={styles.skills}>
          {student.skills.map((skill, index) => (
            <View key={`${skill}-${index}`} style={styles.skill}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {!isOriginalStudent ? (
        <Pressable style={styles.removeButton} onPress={handleRemove}>
          <Text style={styles.removeText}>Remove from Directory</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    padding: 18,
    borderRadius: 14,
    elevation: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D1F4E",
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 5,
  },
  bio: {
    fontSize: 14,
    color: "#334155",
    marginTop: 10,
    lineHeight: 20,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  skill: {
    backgroundColor: "#CCFBF1",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  skillText: {
    color: "#115E59",
    fontSize: 12,
  },
  removeButton: {
    marginTop: 16,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  removeText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "600",
  },
});