import React, { useState, useEffect, useRef } from 'react';
import { PostData } from '../../api/index';
import './inputfield.css';

const Inputfield = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [answer, setAnswer] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current.onresult = (event) => {
      const resultIndex = event.resultIndex;
      const transcript = event.results[resultIndex][0].transcript;
      setTranscript(transcript);

      sendTranscriptToBackend(transcript);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onstart = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onresult = null;
      }
    };
  }, []);

  useEffect(() => {
    if (answer) {
      convertTextToSpeech(answer);
    }
  }, [answer]);

  const handleStartRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      recognitionRef.current.start();
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const sendTranscriptToBackend = async (transcript) => {
    try {
      const response = await PostData({ data: transcript });
      if (response.status === 200) {
        console.log('Transcript sent to the backend successfully.');
        setAnswer(response.data.message);
      } else {
        console.error('Failed to send transcript to the backend.');
      }
    } catch (error) {
      console.error('An error occurred while sending the transcript:', error);
    }
  };

  const convertTextToSpeech = (text) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="Inputfield">
      <div className="inputfield-box">
        <div className="inputfield-header">Input</div>
        <div className="button-container">
          <button onClick={handleStartRecording}>
            {isRecording ? 'Recording...' : 'Start Recording'}
          </button>
          {isRecording && (
            <button onClick={handleStopRecording}>
              Stop Recording
            </button>
          )}
        </div>
        <div className="transcript">{transcript}</div>
      </div>
      <div className="Outputfield">
        <div className="inputfield-box">
          <div className="inputfield-header">Output</div>
          <div className="answer">{answer}</div>
        </div>
      </div>
    </div>
  );
};

export default Inputfield;
