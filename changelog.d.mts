export interface ReleaseNotes {
  version: string;
  date: string;
  blocks: { type: 'heading' | 'item' | 'paragraph'; text: string }[];
}
export const MAX_CHANGELOG_BYTES: number;
export function releaseHistory(markdown: string): ReleaseNotes[];
export function releaseNotes(markdown: string, version: string): ReleaseNotes | null;
export function notesText(notes: ReleaseNotes): string;
export function readChangelog(response: Response): Promise<string>;
