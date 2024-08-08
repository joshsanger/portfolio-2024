import { useState, useRef } from 'react';
import cn from 'classnames';
import { twMerge } from 'tailwind-merge';

const asciiCharacters = [
  '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>',
  '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~',
];

const WordScramble = ({
  word,
  className,
}: { word: string, className?: string }) => {
  const containerRef = useRef(null);
  const [scrambledWord, setScrambledWord] = useState(word);

  const startAnimation = () => {
    let counter = 0;
    const interval = setInterval(() => {
      const letters = word
        .split('')
        .map((letter) => {
          if (Math.random() < 0.25 && letter !== ' ') {
            // Replace letter with random ASCII character
            return asciiCharacters[Math.floor(Math.random() * asciiCharacters.length)];
          }
          return letter;
        })
        .join('');

      setScrambledWord(letters);

      if (counter === Math.min(word.length * 4, 12)) {
        clearInterval(interval);
        setScrambledWord(word);
      }

      counter++;
    }, 50);
  };

  const handleMouseEnter = () => {
    startAnimation();
  };

  const handleMouseLeave = () => {
    setScrambledWord(word);
  };

  return (
    <span
      ref={containerRef}
      className={cn(twMerge('relative clip inline-block', className))}
      aria-label={word}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="opacity-0 select-none h-[0px] whitespace-no-wrap">{word}</span>
      <span aria-hidden className="left-0 absolute">{scrambledWord}</span>
    </span>
  );
};

export default WordScramble;
