import type { StudyRecordType } from "../types/studyRecordType";
import supabase from "../utils/supabase";

const TABLE_NAME = "study-record";

export async function fetchStudyRecord() {
  const { data, error } = await supabase.from(TABLE_NAME).select("*");
  if (error) throw error;
  return data;
}

export async function fetchStudyIdFromTitle(title: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("id")
    .eq("title", title)
    .maybeSingle();
  if (error || data == null) throw error;
  return data.id;
}

export async function insertStudy(params: StudyRecordType) {
  const { error } = await supabase.from(TABLE_NAME).insert(params);
  if (error) throw error;
}

export async function deleteStudy(id: string) {
  const { res } = await supabase.from(TABLE_NAME).delete().eq("id", id);
  console.log(res);
}
