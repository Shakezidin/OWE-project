import React, { useState } from 'react';
import styles from '../styles/Notes.module.css';

const NotePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Structural');
  const [notes, setNotes] = useState([
    {
      category: 'Structural',
      text: 'Selecting a PV trench requires determining trench length and adding concrete for paved areas.',
    },
    {
      category: 'Electrical',
      text: 'Electrical configurations are linked to site-specific needs such as load side.',
    },
  ]);
  const [newNote, setNewNote] = useState('');

  const categories = [
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

  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { category: selectedCategory, text: newNote }]);
      setNewNote('');
    }
  };

  return (
    <div className={styles.appContainer}>
      {/* Sidebar */}
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
            <div   className={`${styles.categoryDescription} ${
              selectedCategory === category.name ? styles.sidebarActiveDescription : ''
            }`}>
              {category.description}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.notesPanel}>
        <div className={styles.notes}>
          {notes
            .filter((note) => note.category === selectedCategory)
            .map((note, index) => (
              <div key={index} className={styles.note}>
                {note.text}
              </div>
            ))}
        </div>
        <div className={styles.addNote}>
          <textarea
            className={styles.textarea}
            placeholder="Type to add notes..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <button className={styles.button} onClick={handleAddNote}>
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotePage;
