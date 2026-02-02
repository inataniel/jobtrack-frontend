export const STATUS_LABELS = {
  applied: "Jelentkezés elküldve",
  invited_to_interview: "Interjúra behívva",
  interview_done: "Interjú lezajlott",
  test_assigned: "Tesztfeladat kiküldve",
  test_submitted: "Tesztfeladat elküldve",
  offer: "Ajánlatot kaptam",
  rejected: "Elutasítva",
};

export const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);