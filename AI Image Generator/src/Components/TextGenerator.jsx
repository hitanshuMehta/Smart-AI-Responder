// import React, { useRef, useState } from "react";
// import "./TextGenerator.css";
// import { RingLoader } from "react-spinners";

// const TextGenerator = () => {
//   const [generatedText, setGeneratedText] = useState(null);
//   const [question, setQuestion] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const inputRef = useRef(null);

//   const textGenerate = async () => {
//     const prompt = inputRef.current.value.trim();
//     if (!prompt) {
//       alert("Please enter a prompt!");
//       return;
//     }

//     // Clear previous answer but keep the old question until new answer is ready
//     setGeneratedText(null);
//     setQuestion(`• ${prompt}.`);
//     inputRef.current.value = ""; // Clear input field

//     setLoading(true);

//     try {
//       const response = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyD9BS2aF1M1iilmxS23O4s1ZectGTHwB6A`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             contents: [{ parts: [{ text: prompt }] }],
//           }),
//         }
//       );

//       if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//       const data = await response.json();

//       if (
//         !data.candidates ||
//         !data.candidates[0] ||
//         !data.candidates[0].content ||
//         !data.candidates[0].content.parts ||
//         !data.candidates[0].content.parts[0].text
//       ) {
//         throw new Error("Invalid API response structure.");
//       }

//       // Update the new answer after it is received
//       setGeneratedText(`→ ${data.candidates[0].content.parts[0].text}`);
//     } catch (error) {
//       console.error("Error generating text:", error);
//       alert("Error generating text. Check API key and try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter") {
//       textGenerate();
//     }
//   };

//   return (
//     <div className="ai-text-generator">
//       <div className="header">
//         AI Text <span>Generator</span>
//       </div>

//       <div className="search-box">
//         <input
//           type="text"
//           ref={inputRef}
//           className="Search-input"
//           placeholder="Describe the text you want to generate..."
//           autoFocus
//           onKeyDown={handleKeyDown}
//         />
//         <div className="generate-btn" onClick={textGenerate}>
//           {loading ? "Generating..." : "Generate"}
//         </div>
//       </div>

//       {/* Show previous question until new answer is ready */}
//       {question && <div className="generated-text question">{question}</div>}

//       {loading && (
//         <div className="loader-container">
//           <RingLoader size={70} color="#DE1B89" />
//         </div>
//       )}

//       {/* Show the new answer only when it is generated */}
//       {generatedText && <div className="generated-text answer">{generatedText}</div>}
//     </div>
//   );
// };

// export default TextGenerator;



import React, { useRef, useState } from "react";
import "./TextGenerator.css";
import { RingLoader } from "react-spinners";
import { CopyToClipboard } from "react-copy-to-clipboard";
// require('dotenv').config();
const TextGenerator = () => {
  const [generatedText, setGeneratedText] = useState(null);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [copied, setCopied] = useState(false); // State to track if text is copied

  const textGenerate = async () => {
    const prompt = inputRef.current.value.trim();
    if (!prompt) {
      alert("Please enter a prompt!");
      return;
    }

    // Clear previous answer but keep the old question until new answer is ready
    setGeneratedText(null);
    setQuestion(`• ${prompt}.`);
    inputRef.current.value = ""; // Clear input field

    setLoading(true);
    // const apiKey = process.env.API_KEY;
    const apiKey = import.meta.env.REACT_APP_API_KEY;
    // console.log(apiKey);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, // Replace with your API key
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content ||
        !data.candidates[0].content.parts ||
        !data.candidates[0].content.parts[0].text
      ) {
        throw new Error("Invalid API response structure.");
      }

      // Update the new answer after it is received
      setGeneratedText(`→ ${data.candidates[0].content.parts[0].text}`);
    } catch (error) {
      console.error("Error generating text:", error);
      alert("Error generating text. Check API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      textGenerate();
    }
  };

  const handleCopy = () => {
    setCopied(true); // Set copied state to true
    setTimeout(() => setCopied(false), 1500); // Reset copied state after 1.5 seconds
  };

  return (
    <div className="ai-text-generator">
      <div className="header">
        AI Text <span>Generator</span>
      </div>

      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="Search-input"
          placeholder="Describe the text you want to generate..."
          autoFocus
          onKeyDown={handleKeyDown}
        />
        <div className="generate-btn" onClick={textGenerate}>
          {loading ? "Generating..." : "Generate"}
        </div>
      </div>

      {/* Show previous question until new answer is ready */}
      {question && <div className="generated-text question">{question}</div>}

      {loading && (
        <div className="loader-container">
          <RingLoader size={70} color="#DE1B89" />
        </div>
      )}

      {/* Show the new answer only when it is generated */}
      {generatedText && (
        <div className="generated-text answer">
          <span>{generatedText}</span>
          <CopyToClipboard text={generatedText} onCopy={handleCopy}>
            <span className="copy-icon" role="img" aria-label="Copy to clipboard" title="Copy">
              📋
            </span>
          </CopyToClipboard>
          {copied ? <span style={{ color: "red", marginLeft: "5px" }}>Copied!</span> : null}
        </div>
      )}
    </div>
  );
};

export default TextGenerator;
