import React, { useEffect, useState } from 'react';
import styles from '../styles/Notes.module.css';
import { ICONS } from '../../../resources/icons/Icons';
import { format } from 'date-fns';
import CommonComponent from './CommonComponent';

interface Category {
  name: string;
  description: string;
}

interface Note {
  category: string;
  text: string;
  timestamp?: string;
}

const NotePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Structural');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([
    {
      category: 'Structural',
      text: 'Flat Roof (per watt): Additional cost for structural reinforcements required...',
    },
    {
      category: 'Electrical',
      text: 'Electrical configurations are linked to site-specific needs such as load side...',
    },
    {
      category: 'MPU',
      text: 'Meter panel upgrades are often needed for larger systems...',
    },
    {
      category: 'Adder Explanation',
      text: 'Detailed explanation for additional charges based on site specifics...',
    },
    {
      category: 'REASON FOR PRODUCTION/LAYOUT CHANGE',
      text: 'Adjustments made to ensure efficient layout and production compliance...',
    },
    {
      category: 'NOTES FOR INSTALLER',
      text: 'Important details and guidelines for installers to follow...',
    },
  ]);
  const [newNote, setNewNote] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = format(now, 'dd MMM yyyy hh:mm a');
      setCurrentTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [notes]);

  const categories: Category[] = [
    {
      name: 'Structural',
      description:
        'Flat Roof (per watt): Additional cost for structural reinforcements required...',
    },
    {
      name: 'Electrical',
      description:
        'Electrical configurations are linked to site-specific needs such as load side...',
    },
    {
      name: 'MPU',
      description: 'Meter panel upgrades are often needed for larger systems...',
    },
    {
      name: 'Adder Explanation',
      description:
        'Detailed explanation for additional charges based on site specifics...',
    },
    {
      name: 'REASON FOR PRODUCTION/LAYOUT CHANGE',
      description:
        'Adjustments made to ensure efficient layout and production compliance...',
    },
    {
      name: 'NOTES FOR INSTALLER',
      description: 'Important details and guidelines for installers to follow...',
    },
  ];

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const now = new Date();
      const formattedTime = format(now, 'dd MMM yyyy hh:mm a');
      setNotes([
        ...notes,
        { 
          category: selectedCategory, 
          text: newNote,
          timestamp: formattedTime
        }
      ]);
      setNewNote('');
    }
  };

  return (
    <div className={styles.genMain}>
      <div className={styles.appContainer}>
        {/* Sidebar */}
        <div className={styles.sidebarContainer}>
          <div className={styles.sidebar}>
            {categories.map((category) => (
              <div
                key={category.name}
                className={`${styles.sidebarItem} ${
                  selectedCategory === category.name ? styles.sidebarItemActive : ''
                }`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className={styles.categoryName}>{category.name}</div>
                <div
                  className={`${styles.categoryName1} ${
                    selectedCategory === category.name
                      ? styles.cat1Active
                      : styles.cat1InActive
                  }`}
                >
                  {category.description}
                </div>
                <div
                  className={`${styles.categoryTime} ${
                    selectedCategory === category.name ? styles.cat1Active : ''
                  }`}
                >
                  {currentTime}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.notesPanel}>
          <div className={styles.notes}>
            <div className={styles.notes_head} style={{ position: "sticky", top: "0" }}>
              Notes
            </div>
            {notes
              .filter((note) => note.category === selectedCategory)
              .map((note, index) => (
                <div key={index} className={styles.multinotes}>
                  <div className={styles.note}>
                    {note.text}
                    <div className={styles.notes_currTime}>
                      {note.timestamp || currentTime}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className={styles.addNote}>
            <textarea
              className={styles.textarea}
              placeholder="Type to add notes..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddNote();
                }
              }}
            />
            <button className={styles.button} onClick={handleAddNote}>
              <img src={ICONS.Whats_Send} alt="send" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotePage;