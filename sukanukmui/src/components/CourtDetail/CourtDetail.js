import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CourtDetail.css';

const CourtDetail = () => {
  const { id } = useParams(); // Get the CourtID from the URL
  const [court, setCourt] = useState(null); // State to store court data
  const [loading, setLoading] = useState(true); // State for loading status
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Fetch court details
    fetch(`http://localhost:5000/api/courts/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch court details');
        }
        return response.json();
      })
      .then((data) => {
        setCourt(data); // Set the court data
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error('Error fetching court details:', error.message);
        setLoading(false); // Stop loading even if there is an error
      });
  }, [id]);

  // Handle edit button click
  const handleEdit = () => {
    alert('Edit functionality to be implemented!');
    // Example: Navigate to the edit form
    navigate(`/edit-court/${id}`);
  };

  // Handle delete button click
  const handleDelete = () => {
    const confirmation = window.confirm(
      'Are you sure you want to delete this court?'
    );
    if (confirmation) {
      // Example: Call API to delete the court
      fetch(`http://localhost:5000/api/courts/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete the court');
          }
          alert('Court deleted successfully!');
          navigate('/courts'); // Navigate back to courts list
        })
        .catch((error) => {
          console.error('Error deleting court:', error.message);
          alert('Failed to delete the court.');
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!court) {
    return <div>Court not found.</div>;
  }

  return (
    <div className="court-detail-container">
      <header className="detail-header">
        <h1>Venue Details</h1>
      </header>
      <div className="court-card">
        <div className="court-header">
        <strong>NAME <br></br>{court.CourtName} </strong> {/* Court Name */}
        </div>
        <div className="court-body">
          <div className="court-container">
            <div className="court-photo">
            
              <img
                src={`http://localhost:5000/images/${court.CourtPic}`}
                alt={court.CourtName}
              />
            </div>
            <div className="court-details">
              <p>
                <strong>DESCRIPTION <br></br> <br></br> </strong>
                {court.CourtDescription}  {/* Displaying Court Description */}
              </p><br></br>

              
            </div>
          </div>
          <p>
                <strong><br></br>DIRECTION  <br></br>  </strong>{' '} 
                {court.CourtLocation ? (
                  <a
                    href={`https://maps.google.com?q=${encodeURIComponent(court.CourtLocation)}`}
                    className="map-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {court.CourtLocation}  {/* Display Court Location as the link */}
                  </a>
                ) : (
                  'Location not available'
                )}
              </p>

        </div>
        <div className="court-actions">
          <button className="edit-btn" onClick={handleEdit}>
            Edit
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourtDetail;
