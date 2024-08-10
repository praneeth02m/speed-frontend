import React, { useState } from "react";
import "./App.css";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

function App() {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState("");

  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  const analyzeWebsite = async () => {
    try {
      setError(null);
      setApiStatus(apiStatusConstants.inProgress);
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      };
      const response = await fetch(
        "https://speed-backend.onrender.com/analyze",
        options
      );

      const data = await response.json();

      if (response.ok) {
        setMetrics(data);
        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
        setError(data.error || "Failed to analyze the website.");
      }
    } catch (err) {
      setApiStatus(apiStatusConstants.failure);
      setError("Failed to analyze the website.");
    }
  };

  const renderLoadingView = () => (
    <div className="loader">
      <div className="loader-text">Analyzing...</div>
      <div className="loader-bar"></div>
    </div>
  );

  const renderMetrics = () => (
    <div className="metrics-container">
      <h2 className="metrics-header">Performance Metrics</h2>
      <div className="metrics-grid">
        {Object.entries(metrics).map(([key, value]) => (
          <div className="metric-card" key={key}>
            <div className="metric-title">{formatMetricLabel(key)}</div>
            <div className="metric-value">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const formatMetricLabel = (key) => {
    const labels = {
      performance: "Performance Score",
      ttfb: "Time to First Byte (TTFB)",
      lcp: "Largest Contentful Paint (LCP)",
      cls: "Cumulative Layout Shift (CLS)",
      fid: "First Input Delay (FID)",
      fcp: "First Contentful Paint (FCP)",
      speedIndex: "Speed Index",
      tbt: "Total Blocking Time (TBT)",
      tti: "Time to Interactive (TTI)",
      inputLatency: "Estimated Input Latency",
      totalPageSize: "Total Page Size",
      numRequests: "Number of Requests",
    };
    return labels[key] || key;
  };

  const renderContent = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      case apiStatusConstants.success:
        return renderMetrics();
      case apiStatusConstants.failure:
        return <p className="error">{error}</p>;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>SpeedX</h1>
        <p>Website Performance Analyzer</p>
      </div>
      <div className="input-container">
        <input
          type="text"
          className="url-input"
          placeholder="Enter website URL"
          value={url}
          onChange={handleInputChange}
        />
        <button className="analyze-button" onClick={analyzeWebsite}>
          Analyze
        </button>
      </div>
      {renderContent()}
    </div>
  );
}

export default App;
