from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pickle
import pandas as pd
import os
import numpy as np

# -------------------------------
# Define custom classes (as in your training code)
class DecisionTree:
    def __init__(self, max_depth=None, min_samples_split=2):
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        
    class Node:
        def __init__(self, feature=None, threshold=None, left=None, right=None, value=None):
            self.feature = feature
            self.threshold = threshold
            self.left = left
            self.right = right
            self.value = value
            
    def fit(self, X, y):
        self.n_classes = len(np.unique(y))
        self.tree = self._grow_tree(X, y)
        
    def _gini(self, y):
        m = y.size
        return 1.0 - sum((np.sum(y == c) / m) ** 2 for c in range(self.n_classes))
    
    def _best_split(self, X, y):
        m, n = X.shape
        if m <= self.min_samples_split:
            return None, None
            
        best_gini = self._gini(y)
        best_feat, best_thresh = None, None
        
        for feat in range(n):
            thresholds = np.unique(X[:, feat])
            for thresh in thresholds:
                left_idx = X[:, feat] <= thresh
                if np.sum(left_idx) == 0 or np.sum(left_idx) == m:
                    continue
                gini = (self._gini(y[left_idx]) * np.sum(left_idx) +
                        self._gini(y[~left_idx]) * np.sum(~left_idx)) / m
                if gini < best_gini:
                    best_gini = gini
                    best_feat = feat
                    best_thresh = thresh
                    
        return best_feat, best_thresh
    
    def _grow_tree(self, X, y, depth=0):
        if self.max_depth and depth >= self.max_depth:
            return self.Node(value=np.argmax(np.bincount(y)))
            
        feat, thresh = self._best_split(X, y)
        if feat is None:
            return self.Node(value=np.argmax(np.bincount(y)))
            
        left_idx = X[:, feat] <= thresh
        right_idx = ~left_idx
        left = self._grow_tree(X[left_idx], y[left_idx], depth+1)
        right = self._grow_tree(X[right_idx], y[right_idx], depth+1)
        return self.Node(feat, thresh, left, right)
        
    def predict(self, X):
        return [self._predict(x) for x in X]
    
    def _predict(self, x, node=None):
        if node is None:
            node = self.tree
        if node.value is not None:
            return node.value
        if x[node.feature] <= node.threshold:
            return self._predict(x, node.left)
        else:
            return self._predict(x, node.right)

class RandomForest:
    def __init__(self, n_trees=50, max_depth=10, min_samples_split=2, 
                 sample_ratio=0.8, feat_ratio=0.6, random_state=None):
        self.n_trees = n_trees
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.sample_ratio = sample_ratio
        self.feat_ratio = feat_ratio
        self.random_state = random_state
        self.trees = []
        
    def fit(self, X, y):
        if self.random_state is not None:
            np.random.seed(self.random_state)
        
        n_samples, n_features = X.shape
        self.n_classes = len(np.unique(y))
        
        for i in range(self.n_trees):
            sample_idx = np.random.choice(n_samples, int(n_samples * self.sample_ratio), replace=True)
            feat_idx = np.random.choice(n_features, int(n_features * self.feat_ratio), replace=False)
            
            tree = DecisionTree(max_depth=self.max_depth, min_samples_split=self.min_samples_split)
            tree.fit(X[sample_idx][:, feat_idx], y[sample_idx])
            self.trees.append((tree, feat_idx))
            
    def predict(self, X):
        all_preds = np.zeros((X.shape[0], self.n_trees))
        for i, (tree, feat_idx) in enumerate(self.trees):
            all_preds[:, i] = tree.predict(X[:, feat_idx])
        return np.apply_along_axis(lambda x: np.argmax(np.bincount(x.astype(int))), 1, all_preds)

# Monkey-patch custom classes for pickle
import __main__
__main__.DecisionTree = DecisionTree
__main__.RandomForest = RandomForest

# -------------------------------
# FastAPI Setup
app = FastAPI()

# Allow all origins for debugging; adjust as needed for production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Or use ["*"] for all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler to catch errors and return JSON (with CORS headers)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log the error details if needed
    print("Unhandled error:", exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal error occurred."},
    )

class AutismPredictionRequest(BaseModel):
    A1_Score: int
    A2_Score: int
    A3_Score: int
    A4_Score: int
    A5_Score: int
    A6_Score: int
    A7_Score: int
    A8_Score: int
    A9_Score: int
    A10_Score: int
    age: float
    gender: str
    ethnicity: str
    jaundice: bool
    autism: bool
    country_of_residence: str
    used_app_before: bool
    relation: str

# Paths for model and encoders (adjust as needed)
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'ml', 'custom_rf_model.pkl')
encoders_path = os.path.join(current_dir, 'ml', 'encoders.pkl')

with open(model_path, 'rb') as f:
    model = pickle.load(f)
with open(encoders_path, 'rb') as f:
    encoders = pickle.load(f)

@app.post("/autism_prediction")
async def autism_prediction(data: AutismPredictionRequest):
    print("Received payload:", data.dict())
    input_dict = input_parameters.dict()
    input_df = pd.DataFrame([input_dict])
    
    categorical_columns = ['gender', 'ethnicity', 'jaundice', 'austim', 
                           'contry_of_res', 'used_app_before', 'relation']
    
    for column in categorical_columns:
        encoder = encoders.get(column)
        if encoder is None:
            raise HTTPException(status_code=400, detail=f"No encoder for column: {column}")
        # (Optional) Validate that all values are in encoder.classes_
        allowed_values = set(encoder.classes_)
        unseen = set(input_df[column]) - allowed_values
        if unseen:
            raise HTTPException(
                status_code=400,
                detail=f"Column '{column}' contains unseen labels: {unseen}"
            )
        input_df[column] = encoder.transform(input_df[column])
    
    prediction = model.predict(input_df.values)
    probability = 0.0  # Adjust if your model supports probability
    
    return {
        "prediction": "Positive for ASD" if int(prediction[0]) == 1 else "Negative for ASD",
        "probability": float(probability),
        "probability_percentage": f"{probability * 100:.2f}%"
    }

@app.get('/health')
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
