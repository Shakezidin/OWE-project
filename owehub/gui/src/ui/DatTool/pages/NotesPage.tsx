import React, { useEffect, useState } from 'react';
import styles from '../styles/Notes.module.css';
import { ICONS } from '../../../resources/icons/Icons';
import { format } from 'date-fns';
import CommonComponent from './CommonComponent';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getNotesInfo } from '../../../redux/apiActions/DatToolAction/datToolAction';
import DataNotFound from '../../components/loader/DataNotFound';
import MicroLoader from '../../components/loader/MicroLoader';
import { time } from 'console';

interface Category {
  name: string;
  description: string;
}

interface Note {
  category: string;
  text: string;
  timestamp?: string;
}

const NotePage = ({ currentGeneralId }: any) => {

  //Api Integration
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getNotesInfo({ project_id: currentGeneralId }));
  }, [currentGeneralId]);

  const { loading, notesData, error } = useAppSelector((state) => state.datSlice);

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
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '228px',
          }}
        >
          <MicroLoader />
        </div>
      ) : notesData ? (
        <>
          <div className={styles.appContainer}>
            {/* Sidebar */}
            <div className={styles.sidebarContainer}>
              <div className={styles.sidebar}>

                {notesData.map((category: any, index: any) => (
                  <div
                    key={category.title}
                    className={`${styles.sidebarItem} ${selectedCategory === category.title ? styles.sidebarItemActive : ''
                      }`}
                    onClick={() => handleCategoryClick(category.title)}
                  >
                    <div className={styles.categoryName}>{category.title}</div>
                    <div
                      className={`${styles.categoryName1} ${selectedCategory === category.title
                        ? styles.cat1Active
                        : styles.cat1InActive
                        }`}
                    >
                      {category.description[0].note.length > 75
                        ? category.description[0].note.slice(0, 75) + '...'
                        : category.description[0].note}
                    </div>
                    <div
                      className={`${styles.categoryTime} ${selectedCategory === category.title ? styles.cat1Active : ''
                        }`}
                    >
                      {format((category.description[0].created_at), 'dd MMM yyyy hh:mm a')}
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
                {notesData
                  .filter((note: any) => note.title === selectedCategory)
                  .map((note: any) => (
                    <div key={note.title} className={styles.multinotes}>
                      {note.description.map((desc: any, index: any) => (
                        <div key={index} className={styles.note}>
                          {desc.note}
                          <div className={styles.notes_currTime}>
                            {format(desc.created_at, 'dd MMM yyyy hh:mm a')}
                          </div>
                        </div>
                      ))}
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
        </>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <DataNotFound />
        </div>
      )}
    </div>
  );
};

export default NotePage;