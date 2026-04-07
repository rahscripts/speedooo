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
  const [themeMode, setThemeMode] = useState<'system' | 'dark' | 'light'>('system');

  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else if (themeMode === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('dark', 'light');
    }
  }, [themeMode]);

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
    <div id="app-container" style={{ position: "relative" }}>
      <div className="top-actions">
        <button
          className="github-star-btn cursor-pointer"
          onClick={() => setThemeMode(prev => prev === 'system' ? 'dark' : prev === 'dark' ? 'light' : 'system')}
          title="Toggle Theme"
        >
          {themeMode === 'dark' ? (
            <svg height="16" width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          ) : themeMode === 'light' ? (
            <svg height="16" width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          ) : (
            <svg height="16" width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          )}
        </button>
        <a
          href="https://github.com/rahman777/speedooo"
          target="_blank"
          rel="noopener noreferrer"
          className="github-star-btn"
        >
          <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
          </svg>
          Star
        </a>
      </div>

      <div className="header">
        <h1>Speedooo</h1>
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

      <footer className="footer-built">
        Built by <a href="https://xrahman.com" target="_blank" rel="noopener noreferrer">xrahman</a>
      </footer>
    </div>
  );
}
