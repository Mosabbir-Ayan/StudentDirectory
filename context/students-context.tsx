import {
    createContext,
    useContext,
    useReducer,
    type Dispatch,
    type ReactNode,
} from "react";
import { STUDENTS, type Student } from "../data/students";
import {
    studentsReducer,
    type StudentsAction,
} from "./students-reducer";

interface StudentsContextValue {
  students: Student[];
  dispatch: Dispatch<StudentsAction>;
}

const StudentsContext = createContext<StudentsContextValue | null>(null);

export function StudentsProvider({ children }: { children: ReactNode }) {
  const [students, dispatch] = useReducer(studentsReducer, STUDENTS);

  return (
    <StudentsContext.Provider value={{ students, dispatch }}>
      {children}
    </StudentsContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentsContext);

  if (context === null) {
    throw new Error("useStudents must be used inside StudentsProvider");
  }

  return context;
}