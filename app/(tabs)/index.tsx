import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SearchBar from "../../components/search-bar";
import StudentDetail from "../../components/student-detail";
import StudentItem from "../../components/student-item";
import { useStudents } from "../../context/students-context";
import { type Student } from "../../data/students";

export default function StudentDirectoryScreen() {
  const { students, dispatch } = useStudents();
  const [query, setQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return students;
    }

    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(search) ||
        student.studentId.toLowerCase().includes(search) ||
        student.department.toLowerCase().includes(search)
    );
  }, [students, query]);

  const resetStudents = () => {
    const performReset = () => {
      dispatch({ type: "RESET" });
      setSelectedStudent(null);
      setQuery("");
    };

    if (Platform.OS === "web") {
      if (globalThis.confirm("Remove all added students and restore the original list?")) {
        performReset();
      }
      return;
    }

    Alert.alert(
      "Reset Directory",
      "Remove all added students and restore the original list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: performReset,
        },
      ]
    );
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const visibleSelectedStudent = students.find(
    (student) => student.id === selectedStudent?.id
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.titleBar}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Student Directory</Text>
          <Text style={styles.count}>{students.length} students</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.addButton}
            onPress={() => router.push("/(tabs)/add-student")}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </Pressable>

          <Pressable style={styles.resetButton} onPress={resetStudents}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </Pressable>
        </View>
      </View>

      <SearchBar value={query} onChangeText={setQuery} />

      <FlatList
        data={filteredStudents}
        keyExtractor={(student) => student.id}
        renderItem={({ item }) => (
          <StudentItem
            student={item}
            onPress={() => handleSelectStudent(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No students found.</Text>
        }
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />

      {visibleSelectedStudent ? (
        <StudentDetail student={visibleSelectedStudent} />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  titleBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  headingContainer: {
    flex: 1,
  },
  heading: {
    fontSize: 23,
    fontWeight: "800",
    color: "#0D1F4E",
  },
  count: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  addButton: {
    backgroundColor: "#0D9488",
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 9,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  resetButton: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 9,
  },
  resetButtonText: {
    color: "#475569",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  emptyText: {
    textAlign: "center",
    color: "#64748B",
    padding: 24,
  },
});