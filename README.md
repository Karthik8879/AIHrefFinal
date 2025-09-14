# AIHref Analytics Platform

A comprehensive analytics platform built with Spring Boot and Next.js for tracking website performance, visitor insights, and user behavior.

## 🚀 Features

### Backend (Spring Boot)
- **Real-time Analytics**: Track visitors, pageviews, and user behavior
- **Scheduled Aggregation**: Daily analytics processing at midnight
- **MongoDB Integration**: Store raw events and aggregated snapshots
- **REST API**: Comprehensive analytics endpoints
- **Error Handling**: Robust error handling and logging

### Frontend (Next.js)
- **Dynamic Dashboards**: Site-specific analytics dashboards
- **Interactive Charts**: Beautiful data visualization with Recharts
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Live data fetching and updates
- **Modern UI**: Clean, professional interface with Tailwind CSS

## 📊 Analytics Features

- **Visitor Tracking**: Unique visitors and pageviews
- **Geographic Insights**: Top countries and regions
- **Page Performance**: Most visited pages and content
- **Time-based Analysis**: 7-day, 30-day, and all-time views
- **Trend Analysis**: Visitor patterns over time

## 🛠️ Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.5.5**
- **Spring Data MongoDB**
- **MongoDB Atlas**
- **Maven**

### Frontend
- **Next.js 15.5.3**
- **React 19.1.0**
- **TypeScript**
- **Tailwind CSS**
- **Recharts**

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MongoDB Atlas account
- Maven 3.6+

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd AIHrefBackend
   ```

2. **Configure MongoDB**:
   - Update `src/main/resources/application.properties` with your MongoDB Atlas connection string
   - Ensure your database name is set correctly

3. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd AIHrefFrontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
AIHrefFinal/
├── AIHrefBackend/                 # Spring Boot Backend
│   ├── src/main/java/com/aihref/
│   │   ├── controller/           # REST Controllers
│   │   ├── service/             # Business Logic
│   │   ├── repository/          # Data Access Layer
│   │   ├── model/               # Data Models
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── scheduler/           # Scheduled Jobs
│   │   └── exception/           # Error Handling
│   └── src/main/resources/
│       └── application.properties
├── AIHrefFrontend/               # Next.js Frontend
│   ├── app/
│   │   ├── dashboard/[siteId]/  # Dynamic Dashboard Pages
│   │   └── page.tsx             # Home Page
│   ├── components/              # React Components
│   ├── lib/                     # Utilities and API Services
│   └── public/                  # Static Assets
└── README.md
```

## 🔧 API Endpoints

### Analytics
- `GET /api/analytics/summary?siteId={siteId}&range={range}`
  - Get analytics summary for a specific site
  - Parameters:
    - `siteId`: Site identifier (required)
    - `range`: Time range - `7d`, `30d`, or `all` (default: `7d`)

### Response Format
```json
{
  "siteId": "greplus",
  "range": "7d",
  "visitors": 1800,
  "pageviews": 5600,
  "topPages": [
    { "url": "/prep/verbal", "count": 300 },
    { "url": "/prep/quant", "count": 250 }
  ],
  "topCountries": [
    { "country": "IN", "count": 600 },
    { "country": "US", "count": 400 }
  ]
}
```

## 📊 Data Models

### Raw Events Collection
```json
{
  "siteId": "greplus",
  "url": "/prep/verbal",
  "referrer": "https://google.com",
  "country": "IN",
  "timestamp": "2025-09-13T10:30:00Z",
  "anonId": "user123"
}
```

### Daily Snapshots Collection
```json
{
  "siteId": "greplus",
  "date": "2025-09-13",
  "visitors": 250,
  "pageviews": 800,
  "topPages": [
    { "url": "/prep/verbal", "count": 300 }
  ],
  "topCountries": [
    { "country": "IN", "count": 600 }
  ]
}
```

## 🔄 Scheduled Jobs

The application includes a scheduled job that runs every night at midnight:
- Processes all raw events from the previous day
- Groups data by siteId
- Calculates aggregated metrics
- Stores results in daily_snapshots collection

## 🎨 Frontend Features

### Dashboard Pages
- **Dynamic Routing**: `/dashboard/[siteId]`
- **Time Range Selection**: 7d, 30d, all
- **Metric Cards**: Key performance indicators
- **Interactive Charts**: Line and bar charts
- **Responsive Design**: Mobile-friendly interface

### Components
- **MetricCard**: Display key metrics
- **VisitorsChart**: Line chart for visitor trends
- **TopPagesChart**: Bar chart for top pages
- **TopCountriesChart**: Bar chart for top countries
- **LoadingSpinner**: Loading states
- **ErrorMessage**: Error handling

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file:
   ```bash
   mvn clean package
   ```

2. Run the application:
   ```bash
   java -jar target/aihref-backend-0.0.1-SNAPSHOT.jar
   ```

### Frontend Deployment
1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8080)
- `spring.data.mongodb.uri`: MongoDB connection string
- `spring.data.mongodb.database`: Database name

### MongoDB Setup
1. Create a MongoDB Atlas cluster
2. Update the connection string in `application.properties`
3. Ensure the database has the required collections:
   - `raw_events`
   - `daily_snapshots`

## 📝 Development

### Adding New Features
1. Backend: Add new endpoints in `controller` package
2. Frontend: Create new components in `components` directory
3. Update API service in `lib/analytics.ts`

### Testing
- Backend: Use `mvn test` for unit tests
- Frontend: Use `npm test` for component tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔮 Future Enhancements

- Real-time WebSocket updates
- Advanced filtering options
- Export functionality
- User authentication
- Multi-tenant support
- Advanced analytics metrics
- Custom date ranges
- Email reports
- API rate limiting
- Caching layer
