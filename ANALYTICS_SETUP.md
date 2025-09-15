# AIHref Analytics Setup

This document describes the analytics implementation for AIHrefFinal, which tracks visitor events when people visit aihref.com, following the same pattern as GregMatPlusMaster.

## Overview

The analytics system tracks page views and other events from visitors to aihref.com, storing the data in a separate MongoDB database for analysis and insights.

## Architecture

### Frontend (AIHrefFrontend)
- **Analytics Component**: `components/Analytics.tsx`
  - Automatically tracks page views on every page load
  - Generates anonymous user IDs for visitor tracking
  - Sends events to backend API endpoint

### Backend (AIHrefBackend)
- **Analytics Controller**: `controller/AnalyticsController.java`
  - Handles incoming analytics events via `/api/ingest/event`
  - Processes IP addresses for geolocation
  - Stores events in analytics database

- **Data Models**:
  - `model/Event.java`: Main analytics event entity
  - `model/dto/AnalyticsEventRequestDTO.java`: Request DTO for API

- **Services**:
  - `service/GeoLocationService.java`: IP-based location resolution
  - `repository/AnalyticsEventRepository.java`: Data access layer

- **Configuration**:
  - `config/AnalyticsMongoConfig.java`: Separate MongoDB configuration
  - `config/SecurityConfig.java`: CORS and security settings

## Data Structure

### Event Entity
```java
{
  "id": "unique_event_id",
  "siteId": "aihref",
  "eventType": "page_view",
  "anonId": "anon_xyz123_abc456",
  "url": "https://aihref.com/dashboard",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "ts": "2024-01-15T10:30:00Z",
  "country": "United States",
  "city": "New York"
}
```

### Event Types
- `page_view`: Tracked on every page load
- Additional event types can be added as needed

## Database Configuration

### Separate Analytics Database
- **Main Database**: `aihref` (existing application data)
- **Analytics Database**: `aihref_analytics` (analytics events)
- **Collection**: `raw_events`

### MongoDB Connection
```properties
# Main application database
spring.data.mongodb.uri=mongodb+srv://...
spring.data.mongodb.database=aihref

# Analytics database (separate)
analytics.mongodb.uri=mongodb+srv://...
analytics.mongodb.database=aihref_analytics
```

## API Endpoints

### POST `/api/ingest/event`
Accepts analytics events from the frontend.

**Request Body**:
```json
{
  "siteId": "aihref",
  "eventType": "page_view",
  "anonId": "anon_xyz123_abc456",
  "url": "https://aihref.com/dashboard",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "ts": "2024-01-15T10:30:00Z"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Event ingested successfully",
  "eventId": "unique_event_id"
}
```

## Geolocation Service

### IP Resolution
- Uses `ip-api.com` free service (1000 requests/minute)
- Resolves country and city from visitor IP addresses
- Handles localhost and private IPs gracefully
- Fallback to "Unknown" for failed resolutions

### Privacy Considerations
- Only stores country and city (not exact location)
- Anonymous user IDs (no personal information)
- IP addresses are not stored permanently

## Security Configuration

### CORS Settings
- Allows requests from:
  - `http://localhost:*` (development)
  - `https://aihref.com` (production)
  - `https://www.aihref.com` (production)

### Endpoint Access
- `/api/ingest/event` is publicly accessible (no authentication required)
- Designed for anonymous analytics collection

## Frontend Integration

### Automatic Tracking
The Analytics component is integrated into the root layout (`app/layout.tsx`) and automatically:
1. Generates/retrieves anonymous user ID
2. Collects page information (URL, referrer, user agent)
3. Sends analytics event to backend
4. Handles errors gracefully (non-blocking)

### Anonymous ID Generation
- Stored in `localStorage` as `analytics_anon_id`
- Format: `anon_[random]_[timestamp]`
- Persistent across browser sessions
- Unique per browser/device

## Deployment Considerations

### Environment Variables
- Analytics endpoint URL: `https://aihref.com/api/ingest/event`
- MongoDB connection strings configured in `application.properties`

### Performance
- Non-blocking analytics (doesn't affect page load)
- Async event sending
- Graceful error handling
- Minimal impact on user experience

### Monitoring
- Check analytics database for incoming events
- Monitor API endpoint logs
- Verify geolocation service functionality

## Usage Examples

### Querying Analytics Data
```javascript
// Find all page views for aihref site
db.raw_events.find({
  "siteId": "aihref",
  "eventType": "page_view"
})

// Find events from specific country
db.raw_events.find({
  "siteId": "aihref",
  "country": "United States"
})

// Find events from last 24 hours
db.raw_events.find({
  "siteId": "aihref",
  "ts": {
    "$gte": new Date(Date.now() - 24*60*60*1000)
  }
})
```

### Analytics Insights
- **Page Views**: Track most visited pages
- **Geographic Data**: Understand visitor locations
- **Referrer Analysis**: See traffic sources
- **User Behavior**: Track anonymous user journeys
- **Time-based Trends**: Analyze traffic patterns

## Troubleshooting

### Common Issues

1. **Analytics events not being sent**
   - Check browser console for errors
   - Verify API endpoint is accessible
   - Check CORS configuration

2. **Geolocation not working**
   - Verify `ip-api.com` service is accessible
   - Check network connectivity
   - Review GeoLocationService logs

3. **Database connection issues**
   - Verify MongoDB connection strings
   - Check AnalyticsMongoConfig logs
   - Ensure separate database exists

### Debugging
- Enable debug logging: `logging.level.com.aihref=DEBUG`
- Check application logs for analytics events
- Monitor MongoDB for incoming data
- Use browser dev tools to inspect network requests

## Future Enhancements

### Additional Event Types
- `click`: Track button/link clicks
- `scroll`: Track page scroll depth
- `session_start`: Track session beginnings
- `session_end`: Track session endings

### Advanced Analytics
- User journey mapping
- Conversion funnel analysis
- Real-time dashboard
- Custom event tracking
- A/B testing integration

### Privacy Enhancements
- GDPR compliance features
- Cookie consent integration
- Data retention policies
- User opt-out mechanisms
