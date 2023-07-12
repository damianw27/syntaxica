import React, { CSSProperties, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import css from './autocomplete.module.css';
import { CaretData, defaultCaretData } from '$components/code-editor/types/caret-data';
import { SuggestionWithAccuracy } from '$components/autocomplete/types/suggestion-with-accuracy';
import { useDebouncedEffect } from '$hooks/debounce/debounced-effect';
import { WordData } from '$components/autocomplete/types/word-data';
import { WordExtraction } from '$components/autocomplete/types/word-extraction';

export interface AutocompleteProps {
  readonly caretData: CaretData;
  readonly code: string;
  readonly keywords: string[];
  readonly textAreaElement?: HTMLTextAreaElement;
  readonly onSuggestionAccept: (suggestion: string, wordData?: WordData) => void;
}

export function Autocomplete({
  caretData,
  keywords,
  code,
  textAreaElement,
  onSuggestionAccept,
}: AutocompleteProps): ReactElement {
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const [currentWordData, setCurrentWordData] = useState<WordData>();
  const [shouldShowModal, setShouldShowModal] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number>(-1);
  const [shouldSkipNextChange, setShouldSkipNextChange] = useState<boolean>(false);
  const optionsRef = useRef<HTMLUListElement>(null);

  const handleOptionClick = (index: number) => {
    onSuggestionAccept(currentSuggestions[index], currentWordData);
    setShouldSkipNextChange(true);
    textAreaElement?.focus();
  };

  const assemblyOption = (value: string, index: number): ReactElement => {
    const isSelectedClass = selectedOption === index ? css.autocompleteModalSelectedElement : '';

    return (
      <li
        className={`${css.autocompleteModalElement} ${isSelectedClass}`}
        key={`autocomplete-option-${index}`}
        data-testid={`ti-autocomplete-option-${index}`}
        onClick={() => handleOptionClick(index)}
      >
        {value}
      </li>
    );
  };

  const isWhiteSpace = (char: string): boolean => /[\s \r\n]/.test(char);

  const getWordBackwards = (input: string, startIndex: number): WordExtraction => {
    let word = '';
    let lastIndex = startIndex;

    for (let i = startIndex - 1; i >= 0; i -= 1) {
      if (isWhiteSpace(input[i])) {
        break;
      }

      word = input[i] + word;
      lastIndex = i;
    }

    return {
      word,
      wordData: {
        startIndex: lastIndex,
        length: startIndex - lastIndex,
      },
    };
  };

  const calculateAccuracy = (word1: string, word2: string): number => {
    const word1Upper = word1.toUpperCase();
    const word2Upper = word2.toUpperCase();

    if (word1.length > word2.length && word1Upper.startsWith(word2Upper)) {
      return (word2.length / word1.length) * 2;
    }

    const set1 = new Set(word1Upper);
    const set2 = new Set(word2Upper);
    const intersection = new Set([...set1].filter((char) => set2.has(char)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  };

  const assemblySuggestionForWords = (word1: string, word2: string): SuggestionWithAccuracy => ({
    word: word2,
    accuracy: calculateAccuracy(word2, word1),
  });

  const findSimilarWords = (inputWord: string, wordsList: string[]): SuggestionWithAccuracy[] =>
    wordsList
      .map((word) => assemblySuggestionForWords(inputWord, word))
      .sort((a, b) => b.accuracy - a.accuracy)
      .filter((suggestion) => suggestion.accuracy > 0.6);

  useDebouncedEffect(
    () => {
      setCurrentSuggestions([]);
      setShouldShowModal(false);

      if (shouldSkipNextChange) {
        setShouldSkipNextChange(false);
        setCurrentWordData(undefined);
        return;
      }

      const { word, wordData } = getWordBackwards(code, caretData.index);

      if (word.length <= 1) {
        return;
      }

      const suggestions = findSimilarWords(word, keywords).map((suggestion) => suggestion.word);
      setCurrentSuggestions(suggestions);
      setSelectedOption(suggestions.length !== 0 ? 0 : -1);
      setCurrentWordData(wordData);
      setShouldShowModal(suggestions.length !== 0);
    },
    {
      deps: [caretData, keywords, code],
    },
  );

  const handleEnterKey = useCallback(
    (event: globalThis.KeyboardEvent) => {
      event.preventDefault();
      onSuggestionAccept(currentSuggestions[selectedOption], currentWordData);
      setShouldSkipNextChange(true);
    },
    [currentSuggestions, currentWordData, selectedOption],
  );

  const handleUpKey = useCallback(
    (event: globalThis.KeyboardEvent) => {
      event.preventDefault();

      let newSelectedOption = selectedOption - 1;

      if (newSelectedOption < 0) {
        newSelectedOption = currentSuggestions.length - 1;
      }

      setSelectedOption(newSelectedOption);
    },
    [selectedOption],
  );

  const handleDownKey = useCallback(
    (event: globalThis.KeyboardEvent) => {
      event.preventDefault();

      let newSelectedOption = selectedOption + 1;

      if (newSelectedOption > currentSuggestions.length - 1) {
        newSelectedOption = 0;
      }

      setSelectedOption(newSelectedOption);
    },
    [selectedOption],
  );

  const handleEscapeKey = useCallback(
    (event: globalThis.KeyboardEvent) => {
      event.preventDefault();
      setShouldShowModal(false);
    },
    [selectedOption],
  );

  const handleCtrlEnterKey = useCallback(
    (event: globalThis.KeyboardEvent) => {
      event.preventDefault();
      setShouldShowModal(currentSuggestions.length !== 0);
    },
    [selectedOption],
  );

  const handleKeyDownEvent = useCallback(
    (event: globalThis.KeyboardEvent): void => {
      if (shouldShowModal) {
        if (event.key === 'Enter') {
          handleEnterKey(event);
        }

        if (event.key === 'ArrowUp') {
          handleUpKey(event);
        }

        if (event.key === 'ArrowDown') {
          handleDownKey(event);
        }

        if (event.key === 'Escape') {
          handleEscapeKey(event);
        }
      } else if (event.ctrlKey && event.key === 'Enter') {
        handleCtrlEnterKey(event);
      }
    },
    [shouldShowModal, handleEnterKey, handleUpKey, handleDownKey],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDownEvent);

    return () => {
      document.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, [shouldShowModal, handleKeyDownEvent]);

  useEffect(() => {
    if (currentWordData !== undefined) {
      return;
    }

    setCurrentSuggestions([]);
  }, [currentWordData]);

  const getOptions = (): ReactElement[] =>
    currentSuggestions.map((suggestion, index) => assemblyOption(suggestion, index));

  const getTextAreaTop = (): number => textAreaElement?.getBoundingClientRect().top ?? 0;

  const getTextAreaLeft = (): number => textAreaElement?.getBoundingClientRect().left ?? 0;

  const getModalStyles = (): CSSProperties => ({
    top: `calc(${getTextAreaTop() + caretData.position.x * 20}px + 10px)`,
    left: `calc(${getTextAreaLeft() + caretData.position.y * 7.2}px + 60px)`,
  });

  return (
    <div
      hidden={!shouldShowModal}
      className={css.autocompleteModal}
      style={getModalStyles()}
      data-testid="ti-autocomplete-modal"
    >
      <ul className={css.autocompleteModalList} ref={optionsRef} data-testid="ti-autocomplete-list">
        {getOptions()}
      </ul>
    </div>
  );
}

Autocomplete.defaultProps = {
  caretData: defaultCaretData,
};
