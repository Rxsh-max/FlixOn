import React, { useEffect, useState } from 'react';

const AnimatedSearch = ({searchTerms,setSearchTerms}) => {
  const phrases = [
    "Search through thousands of movies",
    "Inception",
    "The Matrix",
    "Interstellar"
  ];

  const [placeholder, setPlaceholder] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let typingSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));

      if (!isDeleting && charIndex === currentPhrase.length) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }

      setPlaceholder(currentPhrase.substring(0, charIndex));
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  return (
    <div className='search rounded-4xl'>
        <div>
        <img src="search.svg" alt="search" />
        <input
        type="text"
        placeholder={placeholder}
        value={searchTerms}
        onChange={(e)=>setSearchTerms(e.target.value)}
          />
      </div>
    </div>
  );
};

export default AnimatedSearch;
