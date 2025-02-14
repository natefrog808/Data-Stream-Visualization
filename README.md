# Real-Time Data Stream Visualization with Irys

A powerful, interactive visualization tool for real-time data streams with blockchain-based storage using Irys. This tool demonstrates real-time data processing, statistical analysis, and blockchain integration in a user-friendly interface.

## Features

### Real-Time Visualization
- **Multiple Data Streams**: Support for up to 5 concurrent data streams
- **Interactive Charts**: Area charts with real-time updates
- **Color-Coded Streams**: Each stream has a unique color for easy identification
- **Customizable Data Rate**: Adjust the data generation rate from 1-100 points/second

### Statistical Analysis
- **Per-Stream Statistics**: Detailed statistical analysis for each stream
- **Stream Comparison**: Compare multiple streams with scatter plots
- **Box Plot Visualization**: Distribution analysis with interactive box plots
- **Data Point History**: View historical data with blockchain verification

### Educational Features
- **Interactive Tour**: Step-by-step guide to all features
- **Challenges**: Built-in learning challenges for data analysis
- **Glossary**: Comprehensive glossary of terms and concepts
- **Documentation**: In-depth explanations of data and blockchain concepts

### Blockchain Integration
- **Irys Storage**: Each data point is stored on the Irys network
- **Data Verification**: Every point can be verified on the blockchain
- **Export Capability**: Export data with blockchain references

## Technical Implementation

### Core Components

```jsx
// Main visualization component
const DataStreamViz = () => {
  const [dataStreams, setDataStreams] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [dataRate, setDataRate] = useState(50);
  // ... other state management
```

### Data Management
- Stream initialization
- Real-time data updates
- Statistical calculations
- Export functionality

### Irys Integration
The tool uses Irys for permanent data storage and verification:

```javascript
// Data points are stored using the Irys SDK
const uploadDataPoint = async (dataPoint) => {
  try {
    const response = await fetch('http://localhost:8080/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataPoint),
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return { txId: data.transactionId };
  } catch (error) {
    return { error: error.message };
  }
};
```

## Setup and Installation

1. **Prerequisites**
   - Node.js 14+
   - npm or yarn
   - Go 1.16+ (for Irys backend)

2. **Installation**
   ```bash
   # Install dependencies
   npm install

   # Set up Irys backend
   export IRYS_PRIVATE_KEY="your-private-key"
   export MATIC_RPC_ENDPOINT="your-matic-endpoint"
   go run main.go
   ```

3. **Configuration**
   ```javascript
   // Configure Irys connection in backend
   const irysConfig = {
     node: "https://node1.irys.xyz",
     token: "matic",
     // ... other config options
   };
   ```

## Usage

### Basic Usage
1. Start the application
2. Add data streams using the + button
3. Start simulation with the play button
4. View real-time updates and statistics

### Advanced Features
1. **Statistical Analysis**
   - Select streams for comparison
   - View distribution analysis
   - Export data for further analysis

2. **Educational Tools**
   - Complete built-in challenges
   - Reference the glossary
   - Follow the interactive tour

3. **Data Export**
   ```javascript
   // Export data with blockchain references
   const exportData = () => {
     const headers = ['Stream', 'Time', 'Value', 'Transaction ID'];
     const rows = dataStreams.flatMap(stream => 
       stream.data.map(point => 
         [stream.id + 1, point.time, point.value.toFixed(3), point.txId]
       )
     );
     // ... export logic
   };
   ```

## Technical Details

### Performance Optimizations
- Efficient state management with `useMemo`
- Lazy loading of heavy components
- Optimized rendering cycles

### Real-Time Processing
```javascript
useEffect(() => {
  if (!isSimulating) return;

  const interval = setInterval(() => {
    const timestamp = Date.now();
    setDataStreams(streams => {
      // Data stream update logic
    });
  }, 1000 / dataRate);

  return () => clearInterval(interval);
}, [isSimulating, dataRate, dataStreams.length]);
```

### Blockchain Storage
Each data point is stored on Irys with:
- Timestamp
- Value
- Stream identifier
- Transaction ID

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Charts powered by [Recharts](https://recharts.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Blockchain storage by [Irys](https://irys.xyz/)

## Support

For support, please refer to:
- Issue Tracker: GitHub Issues
- Documentation: [Irys Docs](https://docs.irys.xyz/)
- @reefchaingang on x
