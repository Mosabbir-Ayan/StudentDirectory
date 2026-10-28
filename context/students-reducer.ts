import type { Student } from "../data/students";
import { STUDENTS } from "../data/students";

export type StudentsState = Student[];

export type StudentsAction =
  | { type: "ADD_STUDENT"; payload: Student }
  | { type: "REMOVE_STUDENT"; payload: string }
  | { type: "RESET" };

const originalStudentIds = new Set(STUDENTS.map((student) => student.id));

export function studentsReducer(
  state: StudentsState,
  action: StudentsAction
): StudentsState {
  switch (action.type) {
    case "ADD_STUDENT":
      if (
        originalStudentIds.has(action.payload.id) ||
        state.some((student) => student.id === action.payload.id)
      ) {
        return state;
      }

      return [action.payload, ...state];

    case "REMOVE_STUDENT":
      if (originalStudentIds.has(action.payload)) {
        return state;
      }

      return state.filter((student) => student.id !== action.payload);

    case "RESET":
      return [...STUDENTS];

    default:
      return state;
  }
}