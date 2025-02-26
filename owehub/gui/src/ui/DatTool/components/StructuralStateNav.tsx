import React, { useState, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import styles from '../styles/StructuralPage.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import useMatchMedia from '../../../hooks/useMatchMedia';
import downKey from '../assets/downKey.svg'

interface StructuralStateNavProps {
  states: string[];
  activeState: string;
  onStateChange: (state: string) => void;
  isEditing: boolean;
  onAddState: () => void;
  onDeleteState: (state: string) => void;
}

const StructuralStateNav: React.FC<StructuralStateNavProps> = ({
  states,
  activeState,
  onStateChange,
  isEditing,
  onAddState,
  onDeleteState
}) => {
  const [startIndex, setStartIndex] = useState<number>(0);
  const displayCount: number = 3;
  const needsCarousel: boolean = states.length > displayCount;
  const isSmMobile = useMatchMedia('(max-width: 480px)');
  const [openInfoStates,setOpenInfoStates]=useState<boolean>(false);
  
  // Ensure the active state is visible in the carousel
  useEffect(() => {
    const activeStateIndex = states.indexOf(activeState);
    if (activeStateIndex !== -1) {
      const endIndex = startIndex + displayCount;
      if (activeStateIndex < startIndex) {
        setStartIndex(activeStateIndex);
      } else if (activeStateIndex >= endIndex) {
        setStartIndex(Math.max(0, activeStateIndex - displayCount + 1));
      }
    }
  }, [activeState, states, startIndex, displayCount]);

  const moveCarousel = (direction: 'next' | 'prev'): void => {
    setStartIndex(prev => {
      if (direction === 'next') {
        return Math.min(prev + 1, states.length - displayCount);
      } else {
        return Math.max(prev - 1, 0);
      }
    });
  };

  const visibleStates: string[] = needsCarousel
    ? states.slice(startIndex, startIndex + displayCount)
    : states;

  return (
    <div className={styles.carouselContainer}>
      {/* Only show carousel navigation when not editing */}
      {!isEditing && !isSmMobile && needsCarousel && startIndex > 0 && (
        <div
          onClick={() => moveCarousel('prev')}
          className={styles.iconContainer}
          aria-label="Previous states"
        >
          <FiChevronLeft />
        </div>
      )}

      {!isSmMobile ? (
        <div className={styles.stateContainer}>
          {visibleStates.map((state: string) => (
            (!isEditing || activeState === state) && (
              <div
                key={state}
                onClick={() => onStateChange(state)}
                className={`
                  ${activeState === state
                    ? styles.activeState
                    : styles.wordContainer}`}
                aria-pressed={activeState === state}
              >
                {state}
              </div>
            )
          ))}
        </div>
      ) : (
        <div className={styles.infoStateContainer} onClick={()=>{setOpenInfoStates(prev=>!prev)}}> 
          <p className={styles.infoStateContainer_currentState}>{activeState}</p>
          <img src={downKey} alt="" style={{transform:openInfoStates ? "rotate(180deg)":""}}/>
          {
            openInfoStates && 
            <div className={styles.dropDownForInfoStates}> 
            {
              states.map((state, index) =>
                (isEditing &&
                  activeState === state) ||
                  !isEditing ? (
                  <div
                    key={index}
                    className={styles.infoStateOption}
                    style={{backgroundColor:state===activeState? "#377CF6":"", color:state===activeState?"#F3F0F9":""}}
                    onClick={() => onStateChange(state)}
                  >
                    {state}
                  </div>
                ) : null
              ) 
            }
            </div>
          }
        </div>
      )}

      {/* Only show carousel navigation when not editing */}
      {!isEditing && needsCarousel && startIndex < states.length - displayCount && (
        <div
          onClick={() => moveCarousel('next')}
          className={styles.iconContainer}
          aria-label="Next states"
        >
          <FiChevronRight />
        </div>
      )}
    </div>
  );
};

export default StructuralStateNav;