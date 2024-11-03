import React from "react";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const sampleData = [
      {
        text: "Segment text SOS",
        speaker: "SPEAKER_00",
        speakerId: 0,
        is_user: false,
        start: 10.0,
        end: 20.0,
      },

    ];

    fetch("/api?session_id=abc123&uid=user123", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sampleData),
    })
      .then((res) => res.json())
      .then((data) => setData(data.message))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div className="bg-blue-400">
      <p>{!data ? "Loading..." : data}</p>
    </div>
  );
}

export default App;