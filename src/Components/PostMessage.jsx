import { useState, useEffect } from "react";

export const PostMessage = ({ newMessage, fetchPosts }) => {
  const [newPost, setNewPost] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (newPost.length >= 141) {
      setErrorMessage("Oh no, your message is too long!");
    } else {
      setErrorMessage("");
    }
  }, [newPost]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (newPost.length <= 4) {
      setErrorMessage(
        "Your message is too short. At least 5 letters!"
      );
    } else {
      try {
        const options = {
          method: "POST",
          body: JSON.stringify({
            message: newPost,
          }),
          headers: { "Content-Type": "application/json" },
        };

        const response = await fetch(
          "https://happy-thoughts-api-backend-45u2.onrender.com/thoughts",
          options
        );

        if (response.ok) {
          const data = await response.json();
          // Update the local state with the new thought
          newMessage(data);
          // Clear the input field
          setNewPost("");
          // Refresh the message list by calling fetchPosts
          fetchPosts();
        } else {
          // Handle errors if the POST request fails
          console.error("Failed to add a new thought");
        }
      } catch (error) {
        // Handle network or other errors
        console.error("Error occurred while adding a new thought", error);
      }
    }
  };

  return (
    <div className="post-wrapper">
      <h2>What is making you happy right now?</h2>
      <form onSubmit={handleFormSubmit}>
        <textarea
          rows="5"
          cols="50"
          placeholder="If music be the food of love, play on.' – William Shakespeare"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <div>
          <p className="error">{errorMessage}</p>
          <p className={`length ${newPost.length >= 140 ? "red" : ""}`}>
            {newPost.length}/140
          </p>
        </div>
        <button type="submit" id="submitPostBtn">
          <span className="emoji" aria-label="heart emoji">
            ❤️
          </span>
          Send Happy Thought
          <span className="emoji" aria-label="heart emoji">
            ❤️
          </span>
        </button>
      </form>
    </div>
  );
};