const API_BASE_URL = 'http://localhost:8181';

export interface MathEquationRequest {
  equation: string;
}

export interface MathEquationResponse {
  received_equation: string;
}

export interface FileInfo {
  key: string;
  size: number;
  last_modified: string;
  content_type?: string;
  etag?: string;
}

export interface S3Response {
  files: FileInfo[];
  total_count: number;
  bucket_name: string;
}

export interface PaginatedS3Response {
  files: FileInfo[];
  total_count: number;
  bucket_name: string;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface PreviewResponse {
  file_key: string;
  preview_url: string;
  expires_in: number;
  expires_at: number;
}

export const api = {
  // GET request example
  async searchItems(query: string) {
    const response = await fetch(`${API_BASE_URL}/items/1?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  // POST request for math equations
  async sendMathEquation(equation: string): Promise<MathEquationResponse> {
    const response = await fetch(`${API_BASE_URL}/items/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ equation }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Generic POST function for other endpoints
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Generic GET function
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // S3 File Operations
  async listFiles(page: number = 1, pageSize: number = 20, search?: string): Promise<PaginatedS3Response> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString()
    });
    
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    
    return this.get<PaginatedS3Response>(`/api/files?${params.toString()}`);
  },

  async listAllFiles(): Promise<S3Response> {
    return this.get<S3Response>('/api/files/all');
  },

  async refreshCache(): Promise<any> {
    return this.post('/api/files/refresh', {});
  },

  async listFilesWithPrefix(prefix: string): Promise<S3Response> {
    return this.get<S3Response>(`/api/files/${encodeURIComponent(prefix)}`);
  },

  async getFileInfo(fileKey: string): Promise<FileInfo> {
    return this.get<FileInfo>(`/api/files/info/${encodeURIComponent(fileKey)}`);
  },

  async getPreviewUrl(fileKey: string): Promise<PreviewResponse> {
    return this.get<PreviewResponse>(`/api/files/preview/${encodeURIComponent(fileKey)}`);
  },

  // Download helper function
  downloadFile(fileKey: string): void {
    const downloadUrl = `${API_BASE_URL}/api/files/download/${encodeURIComponent(fileKey)}`;
    console.log('Downloading file:', fileKey);
    console.log('Download URL:', downloadUrl);
    
    // Try to open in new tab
    const newWindow = window.open(downloadUrl, '_blank');
    
    // If popup is blocked, try alternative method
    if (!newWindow) {
      console.log('Popup blocked, trying alternative download method');
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileKey.split('/').pop() || 'download';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
