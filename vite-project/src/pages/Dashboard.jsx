import React, { useState } from 'react';
import axios from 'axios';
import LoadingAnimation from '../components/LoadingAnimation';
import GeneratePostButton from '../components/GeneratePostButton';

// API Keys from environment variables
const AZURE_GPT4_API_KEY = "Fj1KPt7grC6bAkNja7daZUstpP8wZTXsV6Zjr2FOxkO7wsBQ5SzQJQQJ99BCACHYHv6XJ3w3AAAAACOGL3Xg";
const AZURE_DALLE_API_KEY = "https://chrlin-openai02.openai.azure.com/openai/deployments/dall-e-3/images/generations?api-version=2024-02-01";

const defaultCharLimits = {
  Twitter: 280,
  Instagram: 2200,
  LinkedIn: 1300,
  Facebook: 63206,
};

const Dashboard = () => {
  const [prompt, setPrompt] = useState('');
  const [postType, setPostType] = useState('Meme');
  const [platform, setPlatform] = useState('Instagram');
  const [wantImage, setWantImage] = useState(false);
  const [generatedPost, setGeneratedPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateTextPost = async (payload) => {
    const endpoint = 'https://ai-aihackthonhub282549186415.openai.azure.com/openai/deployments/gpt4/chat/completions?api-version=2024-02-01';
    try {
      const response = await axios.post(endpoint, {
        messages: [
          { role: 'system', content: 'You are a creative social media content generator.' },
          { role: 'user', content: payload }
        ],
        max_tokens: 300,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_GPT4_API_KEY
        }
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('GPT-4 API Error:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const generateImagePost = async (payload) => {
    const endpoint = 'https://chrlin-openai02.openai.azure.com/openai/deployments/dall-e-3/images/generations?api-version=2024-02-01';
    try {
      const response = await axios.post(endpoint, {
        prompt: payload,
        n: 1,
        size: "1024x1024"
      }, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_DALLE_API_KEY
        }
      });
      return response.data.data[0].url;
    } catch (error) {
      console.error('DALL-E API Error:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const handleGeneratePost = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const defaultLimit = defaultCharLimits[platform];
      const payload = `Generate a ${postType} post for ${platform} (default limit: ${defaultLimit} characters). Content prompt: "${prompt}"`;
      
      let result = '';
      if (wantImage) {
        result = await generateImagePost(payload);
      } else {
        result = await generateTextPost(payload);
      }

      setGeneratedPost(result);
    } catch (error) {
      const errorMessage = error.response 
        ? `Error: ${error.response.status} - ${error.response.data.error?.message || 'Unknown API error'}` 
        : 'Network error or API call failed';
      
      setError(errorMessage);
      setGeneratedPost('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page dashboard-page">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Social Media Post Generator</h2>
        <p className="dashboard-subtitle">Create AI-powered social media content</p>
      </div>

      <div className="generator-card card-shadow">
        <h3 className="card-title">Create a New Post</h3>
        
        {error && (
          <div className="error-message alert alert-danger">
            {error}
          </div>
        )}

        <div className="input-group">
          <label htmlFor="postPrompt">Post Prompt</label>
          <input
            id="postPrompt"
            type="text"
            className="input-field"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter creative prompt for post generation"
          />
        </div>

        <div className="input-group">
          <label htmlFor="postType">Post Type</label>
          <select
            id="postType"
            className="input-field"
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
          >
            <option value="Meme">Meme</option>
            <option value="Personal">Personal Post</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Announcement">Announcement</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="platform">Target Platform</label>
          <select
            id="platform"
            className="input-field"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="LinkedIn">LinkedIn</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="Twitter">Twitter</option>
          </select>
          <small className="platform-note">
            Default character limit for {platform}: {defaultCharLimits[platform]} characters
          </small>
        </div>

        <div className="input-group">
          <span className="group-label">Output Type:</span>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={wantImage}
                onChange={(e) => setWantImage(e.target.checked)}
              />
              Include an AI-generated image? (Text is mandatory)
            </label>
          </div>
        </div>

        <GeneratePostButton 
          loading={loading} 
          onClick={handleGeneratePost} 
        />
      </div>

      {loading && <LoadingAnimation />}

      {generatedPost && (
        <div className="post-preview card-shadow">
          <h3 className="card-title">Generated Post Preview</h3>
          {wantImage ? (
            <img 
              className="post-image" 
              src={generatedPost} 
              alt="AI Generated Image" 
            />
          ) : (
            <p className="post-content">{generatedPost}</p>
          )}
        </div>
      )}
    </section>
  );
};

export default Dashboard;