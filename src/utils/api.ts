const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to get auth token from localStorage
function getToken() {
  return localStorage.getItem('cv_app_token');
}

async function request(endpoint: string, options: RequestInit = {}, isFormData = false) {
  const token = getToken();
  let headers: Record<string, string> = {};
  if (options.headers) {
    headers = { ...options.headers as Record<string, string> };
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'API Error');
  }
  return res.json();
}

// Auth APIs
type RegisterData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

type LoginData = {
  email: string;
  password: string;
};

export async function register(data: RegisterData) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginData) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// User profile
export async function getProfile() {
  return request('/users/me');
}

// File upload
export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const token = getToken();
  const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE_URL}/file/upload`, {
    method: 'POST',
    body: formData,
    headers,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'File upload failed');
  }
  
  const response = await res.json();
  
  // Handle null or undefined response
  if (response === null || response === undefined) {
    throw new Error('No CV data was extracted from the file. Please try a different file.');
  }
  
  return response;
}

// File description
type DescribeFileOrTextParams = { file?: File; text?: string };

export async function describeFileOrText({ file, text }: DescribeFileOrTextParams) {
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    return request('/files/describe', {
      method: 'POST',
      body: formData,
    }, true);
  } else if (text) {
    return request('/files/describe', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  } else {
    throw new Error('Either file or text must be provided');
  }
}

// Get file info
export async function getFileInfo(id: string) {
  return request(`/files/${id}`);
} 