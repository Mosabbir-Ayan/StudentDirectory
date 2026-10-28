import { StyleSheet, Text, TextInput, View } from "react-native";

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export default function FormField({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  multiline = false,
  autoCapitalize = "sentences",
}: FormFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[styles.input, multiline && styles.multiline, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        autoCapitalize={autoCapitalize}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 7,
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    color: "#0F172A",
    fontSize: 14,
  },
  multiline: {
    minHeight: 100,
  },
  inputError: {
    borderColor: "#DC2626",
  },
  error: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 5,
  },
});