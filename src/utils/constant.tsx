import { MedicationCourse } from "@src/features/Medications/MedicationMutationTypes";

const ONE = 1;

const MEDICATION_COURSE_ELEMENT: MedicationCourse = {
  date: undefined,
  timesPerDay: undefined,
  doses: [{ value: undefined, time: undefined }],
};

enum MERIDIEMS {
  AM = "AM",
  PM = "PM",
}

export { ONE, MEDICATION_COURSE_ELEMENT, MERIDIEMS };
