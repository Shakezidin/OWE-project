export interface SpeedDataPoint {
    value: {
      [state: string]: number;
    };
  }
  
  export interface SpeedData {
    [metric: string]: SpeedDataPoint[];
  }
  
  export interface TransformedGraphData {
    name: string;
    [metricStateKey: string]: string | number;
  }
  
  export interface TableData {
    column1: string;
    column2: number;
  }
  