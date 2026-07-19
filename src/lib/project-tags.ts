export function getProjectTagLabel(
  tag: string,
  tagLabels: Record<string, string>,
): string {
  return tagLabels[tag] ?? tag;
}

export function isUiUxCompetencyProject(tags: string[]): boolean {
  return tags.includes("ui-ux-competency");
}

export function isUiUxClientProject(tags: string[]): boolean {
  return tags.some((tag) => tag === "manokwari" || tag === "sumpiuh");
}
