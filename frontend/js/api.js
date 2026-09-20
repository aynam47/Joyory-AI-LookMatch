const API_BASE_URL = 'http://localhost:8000/api';

const API = {
    async analyzeImage(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch(`${API_BASE_URL}/ai/image`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Failed to analyze image');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async analyzeText(text) {
        try {
            const response = await fetch(`${API_BASE_URL}/ai/product-name`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });
            if (!response.ok) throw new Error('Failed to analyze text');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async getMatches(attributes) {
        try {
            const response = await fetch(`${API_BASE_URL}/match`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(attributes)
            });
            if (!response.ok) throw new Error('Failed to find matches');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    
    async getAllProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) throw new Error('Failed to fetch products');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
