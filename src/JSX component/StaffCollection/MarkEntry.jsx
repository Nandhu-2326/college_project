import React from 'react';
import { useSubject } from './SubjectContext';

const MarkEntry = () => {
  const { selectedSubject } = useSubject(); 

  return (
    <>
      <h2 className="text-center text-primary mt-4">Mark Entry Page</h2>

      {selectedSubject ? (
        <div className="container mt-4">
          <h4>Selected Subject:</h4>
          <p><strong>Subject:</strong> {selectedSubject.subject}</p>
          <p><strong>Department:</strong> {selectedSubject.department}</p>
          <p><strong>Year:</strong> {selectedSubject.year}</p>
          <p><strong>Class & Degree:</strong> {selectedSubject.class} - {selectedSubject.ugorpg}</p>
          {/* You can add your mark entry form here */}
        </div>
      ) : (
        <p className="text-center text-danger fw-bold mt-4">
          No subject selected. Please go back and select a subject.
        </p>
      )}
    </>
  );
};

export default MarkEntry;
