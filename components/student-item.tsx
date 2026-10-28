import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { Student } from "../data/students";

interface StudentItemProps {
  student: Student;
  onPress: () => void;
}

export default function StudentItem({
  student,
  onPress,
}: StudentItemProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {student.avatarUrl ? (
        <Image source={{ uri: student.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.initial}>
            {student.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.studentId}>{student.studentId}</Text>
        <Text style={styles.department}>{student.department}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    fontSize: 22,
    fontWeight: "700",
    color: "#115E59",
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D1F4E",
  },
  studentId: {
    fontSize: 13,
    color: "#475569",
    marginTop: 3,
  },
  department: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
});