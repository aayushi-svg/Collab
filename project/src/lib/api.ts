import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AutoFillRequest {
  prompt: string;
}

export interface AutoFillResponse {
  extracted_details: {
    name?: string;
    email?: string;
    phone?: string;
    education?: string[];
    experience?: string[];
    skills?: string[];
    projects?: string[];
  };
}

export interface GenerateResumeRequest {
  templateId: string;
  userDetails: Record<string, any>;
}

export interface ResumeResponse {
  latex_code: string;
}

export const autoFillForm = async (prompt: string): Promise<AutoFillResponse> => {
  const response = await api.post<AutoFillResponse>('/auto_fill_form', { prompt });
  return response.data;
};

export const generateResume = async (
  templateId: string,
  userDetails: Record<string, any>
): Promise<ResumeResponse> => {
  const response = await api.post<ResumeResponse>('/generate_resume', {
    templateId,
    userDetails,
  });
  return response.data;
};

export default api;
