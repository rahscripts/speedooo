"use client";

import React, { useState, useEffect, useCallback } from "react";
import "./speedReader.css";

export default function SpeedReader() {
  const [text, setText] = useState(
    "The human brain is a remarkable organ, capable of processing enormous amounts of information every second. Yet most people read far below their potential speed, often because of subvocalisation — the habit of silently pronouncing each word in our heads as we read. Speed reading techniques aim to break this habit by training the eye and brain to recognise words as visual patterns rather than sounds. One of the most effective methods is rapid serial visual presentation, or RSVP, which flashes words one at a time at the centre of vision, eliminating the need for eye movements across a page. Research suggests that with regular practice, readers can significantly increase their words-per-minute rate while maintaining or even improving comprehension. The key is consistent training and gradually increasing the reading speed over time, letting the brain adapt to the new rhythm of information intake."
  );
  
  const [words, setWords] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [wpm, setWpm] = useState(200);
  const [running, setRunning] = useState(false);

  const wpmOptions = [150, 200, 250, 300, 400, 500];

  const getPivotIndex = (word: string) => {
    const len = word.length;
    if (len <= 1) return 0;
    if (len <= 5) return 1;
    if (len <= 9) return 2;
    return 3;
  };

  const renderWord = (word: string) => {
    if (!word) return null;
    const pi = getPivotIndex(word);
    const pre = word.slice(0, pi);
    const pivot = word[pi];
    const post = word.slice(pi + 1);
    return (
      <>
        <span style={{ color: "var(--color-text-tertiary)" }}>{pre}</span>
        <span className="pivot">{pivot}</span>
        <span style={{ color: "var(--color-text-primary)" }}>{post}</span>
      </>
    );
  };

  useEffect(() => {
    if (!running) return;
    
    const delay = Math.round(60000 / wpm);
    const timer = setInterval(() => {
      setIdx((prev) => {
        if (prev >= words.length - 1) {
          setRunning(false);
          return prev + 1;
        }
        return prev + 1;
      });
    }, delay);

    return () => clearInterval(timer);
  }, [running, wpm, words.length]);

  const hasStarted = words.length > 0;
  const isDone = hasStarted && idx >= words.length;

  const start = useCallback(() => {
    const raw = text.trim();
    if (!raw) return;
    const splitWords = raw.split(/\s+/).filter(Boolean);
    if (!splitWords.length) return;
    setWords(splitWords);
    setIdx(0);
    setRunning(true);
  }, [text]);

  const pause = () => setRunning(false);
  const resume = () => setRunning(true);

  const reset = () => {
    setRunning(false);
    setIdx(0);
    setWords([]);
  };

  const handlePlayToggle = useCallback(() => {
    if (!running && (!hasStarted || isDone)) {
      start();
    } else if (running) {
      pause();
    } else {
      resume();
    }
  }, [running, hasStarted, isDone, start]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target instanceof Element && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        handlePlayToggle();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handlePlayToggle]);

  return (
    <div id="app-container">
      <div className="header">
        <h1>Speed Reader</h1>
        <p>Paste text, choose your pace, and read one word at a time.</p>
      </div>

      <div className="card">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here... articles, essays, emails, anything you want to read faster."
        />
        <div className="controls">
          <div className="wpm-group">
            {wpmOptions.map((val) => (
              <button
                key={val}
                className={`wpm-btn ${wpm === val ? "active" : ""}`}
                onClick={() => setWpm(val)}
              >
                {val}
              </button>
            ))}
          </div>
          <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>
            WPM
          </span>
          <div className="action-btns">
            <button className="btn-reset" onClick={reset}>
              Reset
            </button>
            <button className="btn-play" onClick={handlePlayToggle}>
              {!hasStarted ? "Start" : isDone ? "Start" : running ? "Pause" : "Resume"}
            </button>
          </div>
        </div>
      </div>

      <div className="reader-area">
        {hasStarted && !isDone && <div className="guide-line"></div>}
        
        <div className="word-display">
          {!hasStarted ? (
            <span className="status-idle">Press Start to begin</span>
          ) : isDone ? (
            <span style={{ color: "#1D9E75", fontSize: "36px" }}>Done</span>
          ) : (
            renderWord(words[idx])
          )}
        </div>

        {hasStarted && !isDone && (
          <>
            <div className="reader-meta">
              <div className="meta-item">
                <div className="meta-val">{wpm}</div>
                <div className="meta-lbl">WPM</div>
              </div>
              <div className="meta-item">
                <div className="meta-val">{idx + 1}</div>
                <div className="meta-lbl">Word</div>
              </div>
              <div className="meta-item">
                <div className="meta-val">{words.length - idx - 1}</div>
                <div className="meta-lbl">Remaining</div>
              </div>
              <div className="meta-item">
                <div className="meta-val">
                  {((words.length - idx - 1) / wpm).toFixed(1)}
                </div>
                <div className="meta-lbl">Min left</div>
              </div>
            </div>
            
            <div className="progress-bar-container">
              <div
                className="progress-fill"
                style={{ width: `${Math.round(((idx + 1) / words.length) * 100)}%` }}
              ></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
