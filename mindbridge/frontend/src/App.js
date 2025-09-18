import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function App() {
  const [journal, setJournal] = useState("");
  const [result, setResult] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");

  const analyzeMood = async () => {
    if (!journal.trim()) return;

    try {
      const res = await axios.post("http://127.0.0.1:5000/analyze", { text: journal });
      setResult(res.data);
    } catch (error) {
      alert("Error connecting to backend");
      console.error(error);
    }
  };

  const addPost = async () => {
    if (!postText.trim()) return;

    try {
      const res = await axios.post("http://127.0.0.1:5000/posts", { text: postText });
      setPosts([...posts, res.data.post]);
      setPostText("");
    } catch (error) {
      alert("Error posting to backend");
      console.error(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/posts");
      setPosts(res.data);
    } catch (error) {
      alert("Error fetching posts");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", maxWidth: 800, margin: "0 auto" }}>
      <motion.h1
        style={{ fontSize: 32, marginBottom: 20 }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        🌉 MindBridge
      </motion.h1>

      {/* Journal Input */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20 }}>How are you feeling today?</h2>
        <textarea
          style={{ width: "100%", padding: 10, marginTop: 10 }}
          rows="3"
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
        ></textarea>
        <button onClick={analyzeMood} style={{ marginTop: 10, padding: "8px 16px" }}>
          Analyze Mood
        </button>

        {result && (
          <motion.div style={{ marginTop: 20, padding: 10, background: "#eee" }}>
            <p><strong>Mood:</strong> {result.mood}</p>
            <p><strong>Confidence:</strong> {result.confidence}</p>
            <p style={{ color: "green" }}>{result.suggestion}</p>
          </motion.div>
        )}
      </div>

      {/* Community Posts */}
      <div>
        <h2 style={{ fontSize: 20 }}>Anonymous Support Circle</h2>
        <textarea
          style={{ width: "100%", padding: 10, marginTop: 10 }}
          rows="2"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        ></textarea>
        <div style={{ marginTop: 10 }}>
          <button onClick={addPost} style={{ marginRight: 10, padding: "6px 12px" }}>Post</button>
          <button onClick={fetchPosts} style={{ padding: "6px 12px" }}>Refresh</button>
        </div>

        <div style={{ marginTop: 20 }}>
          {posts.map((p) => (
            <motion.div key={p.id} style={{ padding: 10, marginBottom: 10, background: "#f4f4f4" }}>
              {p.text}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
