document.addEventListener('DOMContentLoaded', () => {
    
    // UI Elements
    const matchTabsContent = document.getElementById('matchTabsContent');
    const matchTabs = document.getElementById('matchTabs');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');

    // State
    let currentImageFile = null;

    // --- Helper Functions ---
    const showLoading = () => {
        matchTabsContent.classList.add('d-none');
        matchTabs.classList.add('d-none');
        loadingSpinner.style.display = 'block';
        errorAlert.classList.add('d-none');
    };

    const hideLoading = () => {
        matchTabsContent.classList.remove('d-none');
        matchTabs.classList.remove('d-none');
        loadingSpinner.style.display = 'none';
    };

    const showError = (message) => {
        errorMessage.textContent = message;
        errorAlert.classList.remove('d-none');
        hideLoading();
    };

    const processMatch = async (attributes) => {
        try {
            // Save attributes to session storage
            sessionStorage.setItem('ai_attributes', JSON.stringify(attributes));
            
            // Get matches
            const matchData = await API.getMatches(attributes);
            sessionStorage.setItem('match_results', JSON.stringify(matchData.matches));
            
            // Redirect to results page
            window.location.href = 'match-results.html';
        } catch (error) {
            showError("Failed to find matches. Please try again.");
        }
    };

    // --- 1. IMAGE FLOW ---
    const dropZone = document.getElementById('drop-zone');
    const imageInput = document.getElementById('imageInput');
    const uploadPrompt = document.getElementById('upload-prompt');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const submitImageBtn = document.getElementById('submitImageBtn');

    const handleImageSelection = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        currentImageFile = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            uploadPrompt.classList.add('d-none');
            imagePreviewContainer.classList.remove('d-none');
            submitImageBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    };

    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleImageSelection(e.target.files[0]);
    });

    removeImageBtn.addEventListener('click', () => {
        currentImageFile = null;
        imageInput.value = '';
        uploadPrompt.classList.remove('d-none');
        imagePreviewContainer.classList.add('d-none');
        submitImageBtn.disabled = true;
    });

    submitImageBtn.addEventListener('click', async () => {
        if (!currentImageFile) return;
        showLoading();
        try {
            const attributes = await API.analyzeImage(currentImageFile);
            await processMatch(attributes);
        } catch (error) {
            showError("Failed to analyze image. Please ensure your backend is running.");
        }
    });

    // --- 2. TEXT FLOW ---
    const textInput = document.getElementById('textInput');
    const submitTextBtn = document.getElementById('submitTextBtn');

    submitTextBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();
        if (!text) {
            showError("Please enter a product name.");
            return;
        }
        showLoading();
        try {
            const attributes = await API.analyzeText(text);
            await processMatch(attributes);
        } catch (error) {
            showError("Failed to analyze text. Please ensure your backend is running.");
        }
    });

    // --- 3. VOICE FLOW ---
    const micBtn = document.getElementById('micBtn');
    const voiceStatus = document.getElementById('voiceStatus');
    const transcriptionBox = document.getElementById('transcriptionBox');
    const transcriptionText = document.getElementById('transcriptionText');
    const submitVoiceBtn = document.getElementById('submitVoiceBtn');

    let recognition = null;
    let isListening = false;
    let finalTranscript = '';

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            isListening = true;
            micBtn.classList.add('mic-active');
            voiceStatus.textContent = 'Listening... Speak now.';
            transcriptionBox.classList.add('d-none');
            submitVoiceBtn.classList.add('d-none');
        };

        recognition.onresult = (event) => {
            finalTranscript = event.results[0][0].transcript;
            transcriptionText.textContent = `"${finalTranscript}"`;
            transcriptionBox.classList.remove('d-none');
            submitVoiceBtn.classList.remove('d-none');
        };

        recognition.onerror = (event) => {
            showError(`Speech recognition error: ${event.error}`);
            resetMic();
        };

        recognition.onend = () => {
            resetMic();
        };
    } else {
        voiceStatus.textContent = 'Speech recognition is not supported in your browser. Please use Text input.';
        micBtn.disabled = true;
    }

    const resetMic = () => {
        isListening = false;
        micBtn.classList.remove('mic-active');
        if (finalTranscript) {
            voiceStatus.textContent = 'Click to try again.';
        } else {
            voiceStatus.textContent = 'Click the microphone to start listening...';
        }
    };

    micBtn.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
        } else {
            finalTranscript = '';
            recognition.start();
        }
    });

    submitVoiceBtn.addEventListener('click', async () => {
        if (!finalTranscript) return;
        showLoading();
        try {
            // Voice uses the same text analysis endpoint
            const attributes = await API.analyzeText(finalTranscript);
            await processMatch(attributes);
        } catch (error) {
            showError("Failed to analyze voice input.");
        }
    });
});
