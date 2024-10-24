import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { Video } from "lucide-react";
import "./LobbyScreen.css";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      setIsLoading(true);
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="lobby-container">
      <div className="lobby-card">
        {/* Header Section */}
        <div className="lobby-header">
          <div className="icon-container">
            <Video className="icon" />
          </div>
          <h1 className="title">Join Meeting</h1>
          <p className="subtitle">Enter your details to join a video call</p>
        </div>

        {/* Form Section */}
        <div className="form-container">
          <form onSubmit={handleSubmitForm} className="lobby-form">
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Room Input */}
            <div className="form-group">
              <label htmlFor="room" className="form-label">
                Room Code
              </label>
              <input
                type="text"
                id="room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="form-input"
                placeholder="Enter room code"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`submit-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <div className="loading-container">
                  <svg
                    className="loading-spinner"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="spinner-circle"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="spinner-path"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Joining...</span>
                </div>
              ) : (
                "Join Meeting"
              )}
            </button>

            {/* Generate Room Code Link */}
            <div className="generate-code">
              Don't have a room code?{" "}
              <button
                type="button"
                onClick={() => setRoom(Math.random().toString(36).slice(2, 8))}
                className="generate-button"
              >
                Generate one
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LobbyScreen;