# Per Diem App Documentation

## API Structure
All environment variables are stored in the .env file.

### Core API Modules
#### AuthApi: Handles user authentication and verification with the backend
#### Axios: Manages HTTP client configuration and request handling
#### Firebase: Handles Firebase setup and Google Sign-In integration
#### StoreOverride: Contains all CRUD operations for store override times
#### StoreTime: Contains all CRUD operations for basic store operating hours

## Testing
### Running Tests
npm test

### Test Coverage
- User interaction testing for key screens
- Utility function testing (Date utilities, etc.)
- Mock API responses for reliable testing

## Known Issues
### React Native

#### Time Interval Inconsistency: 
- The app displays "30-minute intervals" in some places and "15 minutes" in others. This needs to be standardized across the UI.

### Backend/Swagger API

#### Day Numbering Inconsistency:

- The get day API uses day numbering (0-6)
- The get all API uses day numbering (1-7)
- This inconsistency causes issues with displaying correct closed dates


#### Data Quality Issues:

- The get all endpoint returns an empty object
- Duplicate entry for Friday in the response


#### Documentation Errors:

- Swagger curl examples contain malformed URLs: 'http://https://coding...'



Setup Instructions

### Clone the repository
- add .env file to root
- Install dependencies: npm install
- Install pod: cd ios/pod install
- Run tests: npm test
- Start the development server: npm start
- npm run ios
- npm run android

## app limitations
- adding an animated splash screen caused compatibly issues with firebase, so skipped it
- did not add icon
- if you want to test the notifications you can use "testNotification" or change "DELAY_BEFORE" time to test if fully
- no real loaders, i might add them for fun

## loom
- https://www.loom.com/share/73ac2186323f49aea1e7acffda3ca48b?sid=ff8c60ba-f527-4bae-99a5-8f150169d760