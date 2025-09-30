# Intelligent Financial Close System - Source Code

## Repository Structure
```
intelligent-financial-close/
- src/
  - ml_engine/
    - anomaly_detector.py
    - predictive_model.py
    - data_processor.py
  - automation/
    - workflow_manager.py
    - task_scheduler.py
    - progress_tracker.py
  - api/
    - app.py
    - routes.py
    - database.py
  - dashboard/
    - components/
    - pages/
    - utils/
- data/
- tests/
- docs/
- requirements.txt
```

## Key Source Files

### ML Engine - Anomaly Detection
```python
# anomaly_detector.py
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

class FinancialAnomalyDetector:
    def __init__(self, contamination=0.1, random_state=42):
        self.contamination = contamination
        self.model = IsolationForest(
            contamination=contamination,
            random_state=random_state,
            n_estimators=100
        )
        self.scaler = StandardScaler()
        self.is_fitted = False
    
    def fit(self, X):
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled)
        self.is_fitted = True
    
    def predict(self, X):
        if not self.is_fitted:
            raise ValueError("Model must be fitted before prediction")
        
        X_scaled = self.scaler.transform(X)
        predictions = self.model.predict(X_scaled)
        anomaly_scores = self.model.score_samples(X_scaled)
        
        return predictions, anomaly_scores
```

### Workflow Manager
```python
# workflow_manager.py
import json
from datetime import datetime
from enum import Enum

class TaskStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class WorkflowManager:
    def __init__(self, config_path):
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        self.tasks = {}
        self.initialize_tasks()
    
    def initialize_tasks(self):
        for task_config in self.config['tasks']:
            task = Task(task_config)
            self.tasks[task.id] = task
    
    def execute_workflow(self):
        while not self.is_complete():
            ready_tasks = self.get_ready_tasks()
            for task in ready_tasks:
                self.execute_task(task)
```

### API Backend
```python
# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

@app.route('/api/anomalies', methods=['GET'])
def get_anomalies():
    conn = sqlite3.connect('financial_data.db')
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT * FROM transactions 
        WHERE anomaly_score < -0.5 
        ORDER BY transaction_date DESC
    """)
    
    anomalies = cursor.fetchall()
    conn.close()
    
    return jsonify({
        'anomalies': anomalies,
        'count': len(anomalies)
    })

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    return jsonify({
        'automation_rate': 73.7,
        'ml_confidence': 87,
        'savings_annual': 285000,
        'anomalies_detected': 23
    })
```

### Dashboard Component
```javascript
// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { MetricCard } from './MetricCard';
import { AnomalyChart } from './AnomalyChart';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    fetchMetrics();
    fetchAnomalies();
  }, []);

  const fetchMetrics = async () => {
    const response = await fetch('/api/metrics');
    const data = await response.json();
    setMetrics(data);
  };

  const fetchAnomalies = async () => {
    const response = await fetch('/api/anomalies');
    const data = await response.json();
    setAnomalies(data.anomalies);
  };

  return (
    <div className="dashboard">
      <h1>Financial Close Dashboard</h1>
      <div className="metrics-grid">
        <MetricCard 
          title="Automation Rate"
          value={`${metrics.automation_rate}%`}
          color="green"
        />
        <MetricCard 
          title="ML Confidence"
          value={`${metrics.ml_confidence}%`}
          color="blue"
        />
      </div>
      <AnomalyChart data={anomalies} />
    </div>
  );
};

export default Dashboard;
```

## Installation Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- SQLite 3

### Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_database.py

# Start API server
python src/api/app.py
```

### Frontend Setup
```bash
# Navigate to dashboard directory
cd src/dashboard

# Install dependencies
npm install

# Start development server
npm start
```

### Dependencies (requirements.txt)
```
Flask==2.3.3
Flask-CORS==4.0.0
scikit-learn==1.3.0
pandas==2.0.3
numpy==1.24.3
sqlite3
python-dotenv==1.0.0
gunicorn==21.2.0
```

## Configuration

### Environment Variables
```env
DATABASE_URL=sqlite:///financial_data.db
ML_MODEL_PATH=./models/anomaly_detector.pkl
API_PORT=5000
DEBUG=False
```

### Workflow Configuration (workflow.json)
```json
{
  "tasks": [
    {
      "id": "data_collection",
      "name": "Data Collection",
      "dependencies": [],
      "automation": true,
      "duration_estimate": 30
    },
    {
      "id": "validation",
      "name": "Data Validation",
      "dependencies": ["data_collection"],
      "automation": true,
      "duration_estimate": 45
    }
  ]
}
```

## Testing

### Run Unit Tests
```bash
python -m pytest tests/ -v
```

### Run Integration Tests
```bash
python -m pytest tests/integration/ -v
```

---

*Note: This is a simplified version of the actual source code for demonstration purposes. The complete implementation includes additional error handling, logging, security measures, and optimization features.*

*For the full source code repository, please contact: franck@aethelstone.com*
