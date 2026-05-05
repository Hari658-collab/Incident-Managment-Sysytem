import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function IncidentList() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/incidents")
      .then((res) => res.json())
      .then((data) => {
        const severityOrder = {
          CRITICAL: 1,
          HIGH: 2,
          MEDIUM: 3,
          LOW: 4
        };

        const sorted = data.sort(
          (a, b) => (severityOrder[a.severity] || 5) - (severityOrder[b.severity] || 5)
        );

        setIncidents(sorted);
      });
  }, []);

  return (
    <div>
      <h1>Incident List</h1>

      {incidents.map((incident) => (
        <div key={incident.id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
          <h3>Incident #{incident.id}</h3>
          <p>Status: {incident.status}</p>
          <p>Severity: {incident.severity || "N/A"}</p>

          <Link to={`/incident/${incident.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}

export default IncidentList;