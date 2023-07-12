import { WordData } from '$components/autocomplete/types/word-data';

export interface WordExtraction {
  readonly word: string;
  readonly wordData: WordData;
}
