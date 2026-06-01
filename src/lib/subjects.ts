export type SubjectLike = {
  name: string;
};

const pinyinCollator = new Intl.Collator("zh-Hans-CN-u-co-pinyin", {
  numeric: true,
  sensitivity: "base",
});

export function sortSubjectsByPinyin<T extends SubjectLike>(subjects: T[]) {
  return [...subjects].sort((a, b) => pinyinCollator.compare(a.name, b.name));
}
