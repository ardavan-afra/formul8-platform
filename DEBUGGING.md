# Debugging Guide

This guide explains how to debug both the client and server code in your Formul8 platform.

## Prerequisites

- VS Code with the following extensions:
  - Node.js Extension Pack
  - Chrome Debugger (or Edge Debugger)
- Chrome or Edge browser for client debugging

## Server Debugging

### Method 1: VS Code Debugger (Recommended)

1. **Set breakpoints** in your server code by clicking in the gutter next to line numbers
2. **Start debugging** using one of these options:
   - Press `F5` and select "Debug Server (Nodemon)" from the dropdown
   - Go to Run and Debug panel (Ctrl+Shift+D) and click the play button next to "Debug Server (Nodemon)"
   - Use the Command Palette (Ctrl+Shift+P) and search for "Debug: Start Debugging"

3. **Available server debug configurations:**
   - **Debug Server**: Basic Node.js debugging
   - **Debug Server (Nodemon)**: Debugging with auto-restart on file changes
   - **Attach to Server**: Attach to an already running server process

### Method 2: Command Line Debugging

```bash
# Navigate to server directory
cd server

# Start server with debugging enabled
npm run debug:dev

# Or start with breakpoint on first line
npm run debug:break
```

Then attach VS Code debugger using "Attach to Server" configuration.

### Method 3: Chrome DevTools

1. Start server with debug flag:
   ```bash
   cd server
   npm run debug
   ```

2. Open Chrome and navigate to: `chrome://inspect`
3. Click "Open dedicated DevTools for Node"
4. Set breakpoints in the DevTools Sources tab

## Client Debugging

### Method 1: VS Code Debugger (Recommended)

1. **Start the client** in debug mode:
   ```bash
   cd client
   npm run debug
   ```

2. **Set breakpoints** in your React components
3. **Start debugging** using one of these options:
   - Press `F5` and select "Debug Client (Chrome)" or "Debug Client (Edge)"
   - Go to Run and Debug panel and click the play button next to your preferred browser

### Method 2: Browser DevTools

1. Start the client:
   ```bash
   cd client
   npm start
   ```

2. Open Chrome/Edge DevTools (F12)
3. Go to Sources tab
4. Set breakpoints directly in the browser
5. Use the React Developer Tools extension for component debugging

## Full Stack Debugging

### Debug Both Client and Server Simultaneously

1. **Using VS Code:**
   - Press `F5` and select "Debug Full Stack"
   - This will start both server and client with debugging enabled

2. **Using Command Line:**
   ```bash
   # From project root
   npm run debug:full
   ```

3. **Manual Setup:**
   ```bash
   # Terminal 1 - Server
   cd server
   npm run debug:dev

   # Terminal 2 - Client  
   cd client
   npm run debug
   ```

## Debugging Tips

### Server Debugging Tips

- **Environment Variables**: Make sure your `.env` file is properly configured
- **Database Connection**: Ensure MongoDB is running if using local database
- **API Endpoints**: Use tools like Postman or curl to test endpoints
- **Console Logging**: Add `console.log()` statements for quick debugging
- **Error Handling**: Check the VS Code Debug Console for error messages

### Client Debugging Tips

- **React DevTools**: Install the React Developer Tools browser extension
- **Network Tab**: Use browser DevTools Network tab to debug API calls
- **State Inspection**: Use React DevTools to inspect component state and props
- **Console Logging**: Add `console.log()` statements in components
- **Source Maps**: Ensure source maps are enabled for better debugging experience

### Common Debugging Scenarios

1. **API Call Issues:**
   - Check Network tab in browser DevTools
   - Verify server is running and accessible
   - Check CORS settings in server

2. **Authentication Problems:**
   - Check JWT token in browser storage
   - Verify token expiration
   - Check server middleware

3. **Database Issues:**
   - Check MongoDB connection
   - Verify environment variables
   - Check database queries in server logs

4. **Component State Issues:**
   - Use React DevTools to inspect state
   - Check for state mutations
   - Verify useEffect dependencies

## Available Debug Scripts

### Root Level
- `npm run debug:server` - Start server with debugging
- `npm run debug:client` - Start client with debugging  
- `npm run debug:full` - Start both with debugging

### Server Level
- `npm run debug` - Basic Node.js debugging
- `npm run debug:dev` - Debugging with nodemon
- `npm run debug:break` - Debugging with breakpoint on first line

### Client Level
- `npm run debug` - Start without auto-opening browser
- `npm run debug:chrome` - Start with Chrome browser

## Troubleshooting

### Server Won't Start in Debug Mode
- Check if port 5000 is already in use
- Verify Node.js version compatibility
- Check environment variables

### Client Debugging Not Working
- Ensure Chrome/Edge is installed
- Check if port 3000 is available
- Verify React app is building correctly

### Breakpoints Not Hit
- Ensure source maps are enabled
- Check file paths match exactly
- Restart the debugger if needed

### VS Code Debugger Issues
- Restart VS Code
- Check extension compatibility
- Verify launch.json configuration

## Additional Resources

- [VS Code Debugging Documentation](https://code.visualstudio.com/docs/editor/debugging)
- [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [React Debugging Guide](https://reactjs.org/docs/debugging.html)
- [Chrome DevTools Documentation](https://developers.google.com/web/tools/chrome-devtools)
