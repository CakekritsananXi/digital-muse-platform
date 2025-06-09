
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

interface LogEntry {
  timestamp: string;
  function_name: string;
  status: 'success' | 'error' | 'processing';
  duration?: number;
  message: string;
  metadata?: any;
}

interface GenerationStatus {
  id: string;
  status: string;
  created_at: string;
  processing_time_ms?: number;
  error_message?: string;
}

export const GenerationMonitor = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [generations, setGenerations] = useState<GenerationStatus[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && isMonitoring) {
      loadGenerations();
      const interval = setInterval(loadGenerations, 5000);
      return () => clearInterval(interval);
    }
  }, [user, isMonitoring]);

  const loadGenerations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('id, status, created_at, processing_time_ms, error_message')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading generations:', error);
        return;
      }

      setGenerations(data || []);

      // Simulate log entries for monitoring
      const newLogs: LogEntry[] = (data || []).map(gen => ({
        timestamp: gen.created_at,
        function_name: 'generate-image',
        status: gen.status === 'completed' ? 'success' : 
                gen.status === 'failed' ? 'error' : 'processing',
        duration: gen.processing_time_ms || undefined,
        message: gen.error_message || `Generation ${gen.status}`,
        metadata: { id: gen.id }
      }));

      setLogs(newLogs);
    } catch (error) {
      console.error('Error loading generations:', error);
    }
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    loadGenerations();
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    return ms > 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
  };

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-gold-400" />
          <h3 className="text-lg font-playfair font-semibold gradient-text">Generation Monitor</h3>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={startMonitoring}
            disabled={isMonitoring}
            className="border-gold-500/30"
          >
            Start Monitor
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={stopMonitoring}
            disabled={!isMonitoring}
            className="border-gold-500/30"
          >
            Stop Monitor
          </Button>
        </div>
      </div>

      {isMonitoring && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-green-400">Live monitoring active</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gold-400 mb-2">Recent Generations</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {generations.length === 0 ? (
              <p className="text-sm text-foreground/60">No generations found. Try creating an image first.</p>
            ) : (
              generations.map((gen) => (
                <div key={gen.id} className="flex items-center justify-between p-2 bg-black/30 rounded">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(gen.status)}
                    <span className="text-sm">{gen.id.slice(0, 8)}...</span>
                    <Badge variant="outline" className={`text-xs ${
                      gen.status === 'completed' ? 'border-green-500/30 text-green-400' :
                      gen.status === 'failed' ? 'border-red-500/30 text-red-400' :
                      'border-yellow-500/30 text-yellow-400'
                    }`}>
                      {gen.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-foreground/60">
                    {formatDuration(gen.processing_time_ms)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gold-400 mb-2">Function Logs</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-sm text-foreground/60">No logs available. Start monitoring to see real-time logs.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs p-1">
                  {getStatusIcon(log.status)}
                  <span className="text-foreground/60">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className="text-gold-400">{log.function_name}</span>
                  <span className="text-foreground/80">{log.message}</span>
                  {log.duration && (
                    <span className="text-green-400">{formatDuration(log.duration)}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
