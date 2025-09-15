# Google Gemini AI Integration Setup

This document provides instructions for setting up the Google Gemini AI integration in your AIHref analytics platform.

## Prerequisites

1. **Google Cloud Account**: You need a Google Cloud account with billing enabled
2. **Google AI Studio Access**: Access to Google AI Studio or Google Cloud Console
3. **API Key**: A valid Gemini API key

## Step 1: Get Your Gemini API Key

### Option A: Google AI Studio (Recommended for development)
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Create a new API key
5. Copy the API key for later use

### Option B: Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Generative Language API
4. Go to "APIs & Services" > "Credentials"
5. Create a new API key
6. Copy the API key for later use

## Step 2: Configure Environment Variables

### Backend Configuration

1. **Set Environment Variable**:
   ```bash
   export GEMINI_API_KEY="your-gemini-api-key-here"
   ```

2. **Or Update application.properties**:
   ```properties
   gemini.api.key=your-gemini-api-key-here
   ```

### Frontend Configuration

1. **Create/Update .env.local**:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

## Step 3: Install Dependencies

### Backend Dependencies
The following dependencies have been added to `pom.xml`:

```xml
<!-- Google Gemini AI Integration -->
<dependency>
    <groupId>com.google.ai.client</groupId>
    <artifactId>generativelanguage</artifactId>
    <version>0.7.0</version>
</dependency>

<!-- HTTP Client for API calls -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

### Frontend Dependencies
No additional dependencies are required for the frontend.

## Step 4: Start the Application

1. **Start the Backend**:
   ```bash
   cd AIHrefBackend
   ./mvnw spring-boot:run
   ```

2. **Start the Frontend**:
   ```bash
   cd AIHrefFrontend
   npm run dev
   ```

## Step 5: Test the Integration

1. **Open the Dashboard**: Navigate to `http://localhost:3000`
2. **Enable AI Mode**: Click the AI Mode toggle in the top-right corner
3. **Ask Questions**: Use the AI insights panel to ask questions about your analytics data

## Features

### AI Mode Toggle
- Toggle between regular analytics view and AI-powered insights
- Available on both combined dashboard and individual site dashboards

### AI Insights Panel
- **Summary**: Overview of website performance
- **Key Insights**: Important findings and patterns
- **Trends**: Analysis of traffic patterns and changes
- **Predictions**: Future performance forecasts
- **Recommendations**: Actionable suggestions for improvement

### Supported Questions
You can ask questions like:
- "What are the main trends in my website traffic?"
- "Which pages are performing best and why?"
- "What should I focus on to improve user engagement?"
- "How is my bounce rate compared to industry standards?"
- "What are the top traffic sources and their performance?"

## API Endpoints

### Backend Endpoints

1. **Get AI Insights for Specific Site**:
   ```
   POST /api/ai-analytics/insights
   ```

2. **Get Combined AI Insights**:
   ```
   POST /api/ai-analytics/combined-insights
   ```

3. **Get Quick Insights**:
   ```
   GET /api/ai-analytics/quick-insights/{siteId}
   ```

4. **Get Combined Quick Insights**:
   ```
   GET /api/ai-analytics/combined-quick-insights
   ```

## Configuration Options

### Gemini Configuration (application.properties)
```properties
# Google Gemini AI Configuration
gemini.api.key=${GEMINI_API_KEY:your-gemini-api-key-here}
gemini.model.name=gemini-1.5-flash
gemini.max.tokens=2048
gemini.temperature=0.7
```

### Model Parameters
- **Model**: `gemini-1.5-flash` (fast and cost-effective)
- **Max Tokens**: `2048` (adjust based on your needs)
- **Temperature**: `0.7` (balance between creativity and consistency)

## Troubleshooting

### Common Issues

1. **API Key Not Working**:
   - Verify the API key is correct
   - Check if billing is enabled on your Google Cloud account
   - Ensure the Generative Language API is enabled

2. **CORS Errors**:
   - Verify the frontend URL is added to CORS configuration
   - Check that the backend is running on the correct port

3. **Slow Response Times**:
   - The Gemini API may take a few seconds to respond
   - Consider reducing the `max.tokens` setting for faster responses

4. **Rate Limiting**:
   - Google has rate limits on the Gemini API
   - Consider implementing caching for frequently asked questions

### Error Messages

- **"Unable to generate insights at this time"**: Usually indicates an API key issue or network problem
- **"Error generating insights"**: Check the backend logs for detailed error information

## Security Considerations

1. **API Key Security**:
   - Never commit API keys to version control
   - Use environment variables for production
   - Consider using Google Cloud Secret Manager for production

2. **Data Privacy**:
   - Analytics data is sent to Google's Gemini API
   - Review Google's data usage policies
   - Consider data sensitivity before enabling AI features

## Cost Considerations

- Google Gemini API has usage-based pricing
- Monitor your usage in Google Cloud Console
- Consider implementing caching to reduce API calls
- Set up billing alerts to avoid unexpected charges

## Support

For issues related to:
- **Gemini API**: Check [Google AI Studio documentation](https://ai.google.dev/docs)
- **Backend Integration**: Review the service logs and error messages
- **Frontend Issues**: Check browser console for JavaScript errors

## Future Enhancements

Potential improvements for the AI integration:
1. **Caching**: Implement Redis caching for common queries
2. **Custom Prompts**: Allow users to customize AI prompts
3. **Batch Processing**: Process multiple questions at once
4. **Analytics**: Track AI usage and performance metrics
5. **Export**: Allow users to export AI insights as reports
