import { useEffect, useState } from "react";
import api from "../api/axios";
export interface FeatureFlags {
  timetable_assignment: boolean;
  pdf_export: boolean;
  ai_copilot: boolean;
  schedule_audit: boolean;
  exam_module: boolean;
  attendance_analytics: boolean;
  faculty_workload: boolean;
  leave_approval: boolean;
  grade_submission: boolean;
  study_materials: boolean;
  grid_configuration: boolean;
}
const DEFAULT_FLAGS: FeatureFlags = {
  timetable_assignment: true,
  pdf_export: true,
  ai_copilot: false,
  schedule_audit: false,
  exam_module: false,
  attendance_analytics: false,
  faculty_workload: true,
  leave_approval: true,
  grade_submission: true,
  study_materials: true,
  grid_configuration: true,
};
// In-memory cache — persists for the lifetime of the browser session
// (localStorage is blocked in sandboxed iframes)
let flagsCache: FeatureFlags | null = null;
export function useFeatureFlags(): FeatureFlags {
  const [flags, setFlags] = useState<FeatureFlags>(
    flagsCache ?? DEFAULT_FLAGS
  );
  useEffect(() => {
    if (flagsCache) return; // already fetched this session
    api
      .get<FeatureFlags>("/config/features/")
      .then((r) => {
        flagsCache = r.data;
        setFlags(r.data);
      })
      .catch(() => {
        // silently fall back to defaults — never crash the sidebar
      });
  }, []);
  return flags;
}
