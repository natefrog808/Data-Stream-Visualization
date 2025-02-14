import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus, Minus, Play, Pause, RefreshCw, History, AlertCircle, HelpCircle } from 'lucide-react';

// Tour steps configuration
const TOUR_STEPS = [
  {
    title: "Welcome to Data Stream Visualization",
    content: "This tool helps you understand real-time data streams and blockchain data storage. Let's explore its features!",
    target: "visualization-card",
    position: "center"
  },
  {
    title: "Stream Controls",
    content: "Add or remove data streams using these buttons. Each stream represents a real-time data source stored on Irys.",
    target: "stream-controls",
    position: "bottom"
  },
  {
    title: "Real-time Visualization",
    content: "Watch your data streams in real-time. Click on any point to see its history and blockchain verification.",
    target: "visualization-area",
    position: "left"
  },
  {
    title: "Statistical Analysis",
    content: "Analyze correlations, distributions, and trends in your data. Perfect for understanding patterns across streams.",
    target: "stats-tab",
    position: "right"
  }
];

// Glossary definitions
const GLOSSARY_TERMS = {
  'Data Stream': 'A continuous flow of data points over time, each stored permanently on the Irys network.',
  'Correlation': 'A measure of the relationship between two data streams, showing how they move together.',
  'Blockchain Storage': 'A decentralized way to store data permanently and verifiably using Irys.',
  'Real-time Processing': 'Analysis and visualization of data as it arrives, without delay.',
  'Statistical Analysis': 'Mathematical methods to understand patterns and relationships in data.'
};

const CustomTooltip = ({ active, payload, label, onViewHistory }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white p-4 border rounded shadow-lg">
      <p className="font-medium">{`${-label}s ago`}</p>
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="mt-2" style={{ color: entry.payload.color }}>
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium">{`${entry.name}: ${entry.value.toFixed(3)}`}</p>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onViewHistory(entry.payload)}
              className="h-6 px-2"
            >
              <History className="h-3 w-3 mr-1" />
              History
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

const TourDialog = ({ step, isOpen, onClose, onNext, isLastStep }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{step?.title}</DialogTitle>
        <DialogDescription>{step?.content}</DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Skip Tour</Button>
        <Button onClick={onNext}>{isLastStep ? 'Finish' : 'Next'}</Button>
      </div>
    </DialogContent>
  </Dialog>
);

const DataStreamViz = () => {
  const [dataStreams, setDataStreams] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [dataRate, setDataRate] = useState(50);
  const [totalDataPoints, setTotalDataPoints] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedStreams, setSelectedStreams] = useState([]);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [showTour, setShowTour] = useState(true);
  const [showGlossary, setShowGlossary] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);

  const addAlert = (message, type = 'error') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  const handleViewHistory = (dataPoint) => {
    addAlert(`Data point at ${new Date(dataPoint.timestamp).toLocaleString()}: ${dataPoint.value.toFixed(3)}`, 'info');
  };

  const addDataStream = () => {
    if (dataStreams.length >= 5) {
      addAlert('You can have up to 5 streams at once.');
      return;
    }
    
    const newStream = {
      id: dataStreams.length,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      data: Array(20).fill(0).map((_, i) => ({
        time: -i,
        value: 0,
        timestamp: Date.now() - (i * 1000),
      }))
    };
    
    setDataStreams([...dataStreams, newStream]);
  };

  const removeDataStream = () => {
    if (dataStreams.length <= 1) {
      addAlert('At least one stream must remain active.');
      return;
    }
    setDataStreams(dataStreams.slice(0, -1));
    setSelectedStreams([]);
  };

  const handleNextTourStep = () => {
    if (currentTourStep === TOUR_STEPS.length - 1) {
      setShowTour(false);
    } else {
      setCurrentTourStep(prev => prev + 1);
    }
  };

  // Initialize with one stream
  useEffect(() => {
    if (dataStreams.length === 0) {
      addDataStream();
    }
  }, []);

  // Simulate real-time data processing
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const timestamp = Date.now();
      
      setDataStreams(streams => {
        return streams.map(stream => {
          const base = Math.sin(timestamp / 1000) * (stream.id + 1);
          const value = base + (Math.random() - 0.5) * 0.5;
          
          const newPoint = {
            time: 0,
            value,
            timestamp,
            color: stream.color
          };
          
          const updatedData = [
            newPoint,
            ...stream.data.slice(0, -1).map(point => ({
              ...point,
              time: point.time - 1
            }))
          ];

          return {
            ...stream,
            data: updatedData
          };
        });
      });

      setTotalDataPoints(prev => prev + dataStreams.length);
    }, 1000 / dataRate);

    return () => clearInterval(interval);
  }, [isSimulating, dataRate, dataStreams.length]);

  return (
    <Card className="w-full max-w-4xl" id="visualization-card">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Irys Real-Time Data Stream</span>
          <div className="flex gap-2 items-center" id="stream-controls">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTour(true)}
            >
              <HelpCircle size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSimulating(!isSimulating)}
            >
              {isSimulating ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={addDataStream}
            >
              <Plus size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={removeDataStream}
            >
              <Minus size={16} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {alerts.map(alert => (
            <Alert key={alert.id} variant={alert.type === 'error' ? 'destructive' : 'default'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}

          <Tabs defaultValue="visualization">
            <TabsList>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
              <TabsTrigger value="statistics" id="stats-tab">Statistics</TabsTrigger>
              <TabsTrigger value="glossary">Glossary</TabsTrigger>
            </TabsList>

            <TabsContent value="visualization" className="space-y-4">
              <div className="flex items-center gap-4">
                <RefreshCw size={16} className={isSimulating ? "animate-spin" : ""} />
                <span className="text-sm">
                  Data Rate: {dataRate} points/sec
                </span>
                <div className="flex-1">
                  <Slider
                    value={[dataRate]}
                    onValueChange={([value]) => setDataRate(value)}
                    min={1}
                    max={100}
                    step={1}
                  />
                </div>
              </div>

              <div className="h-96" id="visualization-area">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      type="number"
                      domain={[-20, 0]}
                      tickFormatter={t => Math.abs(t) + 's ago'}
                    />
                    <YAxis domain={[-3, 3]} />
                    <Tooltip content={<CustomTooltip onViewHistory={handleViewHistory} />} />
                    <Legend />
                    {dataStreams.map(stream => (
                      <Area
                        key={stream.id}
                        type="monotone"
                        dataKey="value"
                        data={stream.data}
                        name={`Stream ${stream.id + 1}`}
                        stroke={stream.color}
                        fill={stream.color}
                        fillOpacity={0.1}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="statistics" className="space-y-4">
              <Select
                value={selectedStream ? String(selectedStream.id) : ''}
                onValueChange={(value) => setSelectedStream(dataStreams[parseInt(value)])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a stream" />
                </SelectTrigger>
                <SelectContent>
                  {dataStreams.map(stream => (
                    <SelectItem key={stream.id} value={String(stream.id)}>
                      Stream {stream.id + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TabsContent>

            <TabsContent value="glossary" className="space-y-4">
              <div className="space-y-4">
                {Object.entries(GLOSSARY_TERMS).map(([term, definition]) => (
                  <div key={term} className="p-4 bg-slate-50 rounded">
                    <h3 className="font-medium">{term}</h3>
                    <p className="text-sm text-slate-600 mt-1">{definition}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between text-sm text-gray-500">
            <div>Total Data Points: {totalDataPoints.toLocaleString()}</div>
            <div>Status: {isSimulating ? 'Streaming' : 'Paused'}</div>
          </div>
        </div>
      </CardContent>

      <TourDialog
        step={TOUR_STEPS[currentTourStep]}
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onNext={handleNextTourStep}
        isLastStep={currentTourStep === TOUR_STEPS.length - 1}
      />
    </Card>
  );
};

export default DataStreamViz;
