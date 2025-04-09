import React, { useEffect, useState, useRef } from "react";
import earth from "./assets/world.png";
import { FaArrowLeft, FaPhone, FaVideo, FaEllipsisV } from "react-icons/fa";
import "./App.css";
import { messagesData } from "./messages";
import textState from "./assets/notification/text.mp3";
import deletedState from "./assets/notification/deleted.mp3";
import statusState from "./assets/notification/status.mp3";
import iphoneState from "./assets/notification/iphone.mp3";
import vibroState from "./assets/notification/vibro.mp3";

const getCountryFlag = (countryName) => {
  const countryFlags = {
    Ukraine: "🇺🇦",
    France: "🇫🇷",
    Germany: "🇩🇪",
    Finland: "🇫🇮",
    Spain: "🇪🇸",
    USA: "🇺🇸",
    England: "🇬🇧",
    Russia: "🇷🇺",
    China: "🇨🇳",
    "North Korea": "🇰🇵",
    "South Korea": "🇰🇷",
    IMF: "🏛️",
    Admin: "👮",
    Denmark: "🇩🇰",
    Belarus: "🇧🇾",
    Turkiye: "🇹🇷",
    "Volodymyr Zelensky": "🇺🇦",
    "Petro Poroshenko": "🇺🇦",
    Poroshenko: "🇺🇦",
    "Russian Hackers": "👨‍💻",
  };

  return countryFlags[countryName] || "🏳️";
};

const formatMessageContent = (message) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = message.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="message-link"
        >
          {part}
        </a>
      );
    }

    return part.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < part.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  });
};

const App = () => {
  const [messages, setMessages] = useState([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const chatContainerRef = useRef(null);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (messageIndex < messagesData.length) {
      const timeout = setTimeout(() => {
        setMessages((prev) => [...prev, messagesData[messageIndex]]);
        setMessageIndex((prev) => prev + 1);
      }, 3500);
      return () => clearTimeout(timeout);
    }
  }, [messageIndex]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    let audio = null;

    if (lastMessage.type === "status") {
      audio = new Audio(statusState);
    } else if (lastMessage.type === "typing") {
      audio = new Audio(vibroState);
    } else if (lastMessage.type === "image") {
      audio = new Audio(iphoneState);
    } else if (lastMessage.type === "deleted") {
      audio = new Audio(deletedState);
    } else if (lastMessage.type === "text") {
      audio = new Audio(textState);
    }

    if (audio) {
      audio.play().catch((e) => {
        console.error("Audio play error:", e);
      });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() !== "") {
      const newMessage = {
        sender: "You",
        message: inputText,
        type: "text",
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="whatsapp-container">
      <div className="whatsapp-header">
        <FaArrowLeft className="back-icon" />
        <img src={earth} alt="Group Icon" className="group-icon" />
        <div className="group-info">
          <h3>World Leader Group</h3>
          <p>Çevrimiçi</p>
        </div>
        <div className="header-icons">
          <FaVideo className="header-icon" />
          <FaPhone className="header-icon" />
          <FaEllipsisV className="header-icon" />
        </div>
      </div>
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((msg, index) => {
          if (msg.type === "status") {
            return (
              <div key={index} className="status-container">
                <div className="status-message">{msg.message}</div>
              </div>
            );
          } else if (msg.type === "typing") {
            return (
              <div key={index} className="message-container">
                <div className="message">
                  <div className="sender-info">
                    <span className="sender-flag">
                      {msg.sender === "You" ? "🇺🇦" : getCountryFlag(msg.sender)}
                    </span>
                    <span className="sender-name">{msg.sender}</span>
                  </div>
                  <div className="message-content typing">{msg.message}</div>
                </div>
              </div>
            );
          } else if (msg.type === "deleted") {
            return (
              <div key={index} className="message-container">
                <div className="message">
                  <div className="sender-info">
                    <span className="sender-flag">
                      {msg.sender === "You" ? "🇺🇦" : getCountryFlag(msg.sender)}
                    </span>
                    <span className="sender-name">{msg.sender}</span>
                  </div>
                  <div className="message-content deleted">
                    {formatMessageContent(msg.message)}
                  </div>
                </div>
              </div>
            );
          } else if (msg.type === "sticker") {
            return (
              <div key={index} className="message-container">
                <div className="message">
                  <div className="sender-info">
                    <span className="sender-flag">
                      {msg.sender === "Ukraine"
                        ? "🇺🇦"
                        : getCountryFlag(msg.sender)}
                    </span>
                    <span className="sender-name">{msg.sender}</span>
                  </div>
                  <div className="message-content sticker">
                    <span className="sticker-content">{msg.message}</span>
                  </div>
                </div>
              </div>
            );
          } else if (msg.type === "image") {
            return (
              <div key={index} className="message-container">
                <div
                  className={`message ${
                    msg.sender === "Ukraine" ? "all-right" : ""
                  }`}
                >
                  <div className="sender-info">
                    <span className="sender-flag">
                      {msg.sender === "Ukraine"
                        ? "🇺🇦"
                        : getCountryFlag(msg.sender)}
                    </span>
                    <span className="sender-name">{msg.sender}</span>
                  </div>
                  <div
                    className="message-content image-placeholder"
                    style={{
                      textAlign: `${
                        msg.sender === "Ukraine" ? "right" : "left"
                      }`,
                      alignItems: `${
                        msg.sender === "Ukraine" ? "flex-end" : "flex-start"
                      }`,
                    }}
                  >
                    <img
                      src={msg.imageUrl}
                      alt="Shared"
                      style={{ borderRadius: "7.5px" }}
                    />
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className={`message-container ${
                  msg.sender === "You" || msg.sender === "Ukraine"
                    ? "my-message"
                    : ""
                }`}
              >
                <div
                  className="message"
                  style={{
                    textAlign: `${
                      msg.sender === "You" || msg.sender === "Ukraine"
                        ? "right"
                        : "left"
                    }`,
                  }}
                >
                  <div className="sender-info">
                    <span className="sender-flag">
                      {msg.sender === "You" || msg.sender === "Ukraine"
                        ? "🇺🇦"
                        : getCountryFlag(msg.sender)}
                    </span>
                    <span className="sender-name">{msg.sender}</span>
                  </div>
                  <div
                    className={`message-content ${
                      msg.sender === "You" || msg.sender === "Ukraine"
                        ? "my-message-content"
                        : ""
                    }`}
                  >
                    {formatMessageContent(msg.message)}
                    <span className="message-time">
                      {new Date().getHours().toString().padStart(2, "0")}:
                      {new Date().getMinutes().toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
      <div className="whatsapp-footer">
        <div className="input-container">
          <div className="emoji-button">😀</div>
          <input
            type="text"
            placeholder="Mesaj yazın"
            className="message-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="send-button" onClick={handleSendMessage}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="#128C7E"
                d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
