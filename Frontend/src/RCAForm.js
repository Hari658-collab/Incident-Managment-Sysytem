
import { useState } from "react";

function RCAForm({ incidentId }) {
  const [form, setForm] = useState({
    start_time: "",
    end_time: "",
    root_cause: "",
    fix: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rcaText = `
Start Time: ${form.start_time}
End Time: ${form.end_time}
Root Cause: ${form.root_cause}
Fix: ${form.fix}
`;

    const response = await fetch(`http://localhost:3000/incident/${incidentId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "CLOSED",
        rca: rcaText
      })
    });

    const result = await response.text();
    alert(result);
  };

  return (
    <div>
      <h2>RCA Form</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Start Time</label><br />
          <input type="datetime-local" name="start_time" value={form.start_time} onChange={handleChange} />
        </div>

        <div>
          <label>End Time</label><br />
          <input type="datetime-local" name="end_time" value={form.end_time} onChange={handleChange} />
        </div>

        <div>
          <label>Root Cause</label><br />
          <textarea name="root_cause" value={form.root_cause} onChange={handleChange}></textarea>
        </div>

        <div>
          <label>Fix</label><br />
          <textarea name="fix" value={form.fix} onChange={handleChange}></textarea>
        </div>

        <button type="submit">Close Incident</button>
      </form>
    </div>
  );
}

export default RCAForm;