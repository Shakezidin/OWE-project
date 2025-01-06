import { SpeedData, TransformedGraphData, TableData } from '../types/speedTypes';

export const transformGraphData = (data: SpeedData, metric: string): TransformedGraphData[] => {
  if (!data || !data[metric] || data[metric].length === 0) {
    console.warn(`No data found for metric: ${metric}`);
    return [];
  }

  const weeks = data[metric].length;
  const states = Object.keys(data[metric][0]?.value || {});

  return Array.from({ length: weeks }, (_, index) => {
    const weekNumber = index + 1;
    const point: TransformedGraphData = {
      name: `Week ${weekNumber}`,
    };

    states.forEach(state => {
      const value = data[metric][index]?.value?.[state];
      if (value !== undefined) {
        point[`${metric} (${state})`] = Number((value * 100).toFixed(2));
      }
    });

    return point;
  });
};

export const transformTableData = (data: SpeedData, metric: string): TableData[] => {
  if (!data || !data[metric] || data[metric].length === 0) {
    console.warn(`No data found for metric: ${metric}`);
    return [];
  }

  const states = Object.keys(data[metric][0]?.value || {});

  return states.map(state => {
    const values = data[metric].map(item => item.value?.[state] || 0);
    const average = values.reduce((acc, val) => acc + val, 0) / values.length;

    return {
      column1: `${metric} (${state})`,
      column2: Number((average * 100).toFixed(2)),
    };
  });
};
