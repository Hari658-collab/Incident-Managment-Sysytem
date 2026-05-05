import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RCAForm from "./RCAForm";

function IncidentDetails() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/incident/${id}`)
      .then((res) => res.json())
      .then((data) => setIncident(data));
  }, [id]);

  if (!incident) return <p>Loading...</p>;

  return (
    <div>
      <h1>Incident Details</h1>

      <p><b>ID:</b> {incident.id}</p>
      <p><b>Status:</b> {incident.status}</p>
      <p><b>Severity:</b> {incident.severity || "N/A"}</p>

      <h2>Signals</h2>
      <p>MongoDB signals will show here after signals API is added.</p>

      <RCAForm incidentId={id} />
    </div>
  );
}

export default IncidentDetails;