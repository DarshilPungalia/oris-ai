# Oris AI - RAG-Enhanced Intelligent Dental Consultation Platform

## 🦷 Overview

Oris AI is an advanced AI-powered dental consultation platform featuring **Retrieval Augmented Generation (RAG)** capabilities. It combines a modern Next.js frontend with a sophisticated Python backend powered by LiveKit and LlamaIndex. The platform enables real-time video consultations with an AI dental assistant named "Aria" who has access to a comprehensive dental knowledge base.

## 🧠 RAG-Enhanced Features

### **Intelligent Knowledge Base**
- **Comprehensive Dental Procedures Guide**: Detailed information about all dental treatments
- **Emergency Dental Care Manual**: Urgent care protocols and immediate action steps  
- **Pricing and Services Database**: Complete service offerings and pricing structure
- **Evidence-Based Responses**: All answers backed by professional dental knowledge

### **Enhanced AI Capabilities**
- `search_dental_knowledge()` - Query the comprehensive dental database
- `analyze_dental_image_with_knowledge()` - Vision analysis with knowledge base cross-reference
- `book_appointment_with_context()` - Smart booking with procedure information
- `provide_dental_education()` - Educational content from knowledge base
- `assess_urgency_with_knowledge()` - Symptom analysis using clinical guidelines

## 🏗️ Architecture

### Frontend (Next.js)
- **Location**: `oris-ai/` folder
- **Technology**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Components**: Modern consultation modal, video room, chat interface
- **Features**: Real-time video/audio, chat transcription, appointment booking

### Backend (Python + LiveKit)
- **Location**: `oris-ai-backend/` folder  
- **Technology**: LiveKit Agents, OpenAI GPT-4, Deepgram STT, OpenAI TTS
- **AI Assistant**: "Aria" - Enhanced dental consultant with vision capabilities
- **Features**: Image analysis, appointment booking, urgency assessment, dental tips

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd oris-ai-backend
   ```

2. **Run RAG setup script:**
   ```bash
   # On Windows
   start_rag_agent.bat
   
   # On macOS/Linux
   chmod +x start.sh
   ./start.sh
   ```

3. **Configure environment:**
   - Copy `.env.example` to `.env.local`
   - Fill in your API keys:
     - `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
     - `OPENAI_API_KEY`
     - `DEEPGRAM_API_KEY`
     - Webhook URLs for appointment booking

4. **Knowledge Base Initialization:**
   - The script automatically creates the RAG knowledge base
   - Processes dental data from `oris_dental_data/` folder
   - Creates vector embeddings for intelligent retrieval

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd oris-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   # or
   pnpm install
   ```

3. **Configure environment:**
   - Copy `.env.example` to `.env.local`
   - Set `NEXT_PUBLIC_LIVEKIT_URL` to your LiveKit server
   - Set `ORIS_BACKEND_URL` to your backend URL

4. **Start development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## 🎯 Key Features

### AI Assistant "Aria"
- **Personality**: Warm, professional, highly knowledgeable
- **Capabilities**:
  - Real-time video consultation
  - Dental image analysis using vision capabilities
  - Appointment booking with email confirmation
  - Urgency assessment for dental concerns
  - Dental health tips and preventive care guidance
  - Integration with CRM systems

### Frontend Features
- **Modern UI**: Glassmorphism design with smooth animations
- **Video Room**: LiveKit-powered real-time communication
- **Chat Interface**: Real-time transcription and messaging
- **Responsive Design**: Works on desktop and mobile
- **Accessibility**: Keyboard navigation and ARIA compliance

### Backend Features
- **Enhanced Functions**: 6 specialized AI functions for dental care
- **Image Processing**: Real-time video frame analysis
- **Appointment System**: Webhook integration for booking
- **Error Handling**: Robust error management and logging
- **Scalable Architecture**: Docker deployment ready

## 🔧 Integration Points

### LiveKit Room Flow
```
Patient → Frontend → LiveKit Room → Python Agent (Aria) → AI Processing → Response
```

### API Endpoints
- `POST /api/livekit-token` - Generate room access tokens
- `POST /api/appointments` - Book dental appointments  
- `GET /api/appointments?email=` - Check appointment status

### Webhook Integration
- Appointment booking confirmation
- CRM system integration
- Email notifications

## 📋 Required Environment Variables

### Backend (`.env.local`)
```env
# LiveKit
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret

# AI Services
OPENAI_API_KEY=your_openai_key
DEEPGRAM_API_KEY=your_deepgram_key

# Integration
ORIS_WEBHOOK_URL=your_appointment_webhook
ORIS_API_TOKEN=your_crm_token
CRM_CONTACT_LOOKUP_ENDPOINT=your_crm_api
```

### Frontend (`.env.local`)
```env
# Public (exposed to client)
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-server.com

# Server-side only
ORIS_BACKEND_URL=http://localhost:8000
ORIS_API_SECRET=your_secure_secret
```

## 🐳 Docker Deployment

### Backend
```bash
cd oris-ai-backend
docker-compose up -d
```

### Frontend
```bash
cd oris-ai
docker build -t oris-ai-frontend .
docker run -p 3000:3000 oris-ai-frontend
```

## 🔍 Monitoring & Logging

- **Backend**: Structured logging with timestamps and context
- **Frontend**: Error tracking and performance monitoring
- **Health Checks**: Docker health checks for backend service
- **Analytics**: Optional Vercel Analytics integration

## 🧪 Testing the Integration

1. **Start Backend**: Run `start.bat` or `start.sh`
2. **Start Frontend**: Run `npm run dev`
3. **Open Browser**: Navigate to `http://localhost:3000`
4. **Start Consultation**: Click "Book AI Consultation"
5. **Test Features**:
   - Video/audio connection
   - Chat functionality
   - Image analysis (show dental area to camera)
   - Appointment booking

## 🔒 Security Features

- **JWT Tokens**: Secure room access with expiration
- **API Authentication**: Backend API protection
- **Environment Isolation**: Separate dev/prod configurations
- **HTTPS Only**: Secure communication channels
- **Input Validation**: Sanitized user inputs

## 📞 AI Assistant Capabilities

### Conversation Flow
1. **Greeting**: Aria introduces herself and asks for patient name
2. **Assessment**: Gathers information about dental concerns
3. **Analysis**: Uses vision capabilities if needed
4. **Guidance**: Provides urgency assessment and recommendations
5. **Booking**: Offers appointment scheduling
6. **Follow-up**: Checks appointment status after booking

### Function Calls
- `analyze_dental_image()` - Vision-based dental assessment
- `book_dental_appointment()` - Appointment booking with webhooks
- `check_appointment_status()` - CRM integration for status checks
- `assess_dental_urgency()` - Symptom-based urgency evaluation
- `provide_dental_tips()` - Educational content delivery

## 🎨 Customization

### Frontend Theming
- Modify `app/globals.css` for color schemes
- Update `components/ui/` for component styling
- Customize animations in Framer Motion components

### Backend Personality
- Edit system prompt in `oris_ai_agent.py`
- Modify function descriptions for different behaviors
- Adjust response patterns and conversation flow

## 📈 Performance Optimization

- **Frontend**: Next.js optimizations, image optimization, code splitting
- **Backend**: Async processing, connection pooling, efficient video handling
- **LiveKit**: Optimized room settings, bandwidth management
- **Deployment**: CDN integration, edge deployment options

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation and examples

---

**Oris AI** - Revolutionizing dental care through intelligent conversation. 🦷✨