import React from 'react';

interface BoxProps {
  width: number;
  height: number;
  color: string;
}

const Box: React.FC<BoxProps> = ({ width, height, color }) => {
  const boxStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: color,
  };

  return <div style={boxStyle}></div>;
};

interface BoxesProps {
  color: string;
}

const Boxes: React.FC<BoxesProps> = ({ color }) => {
  return (
    <div>
      <Box width={15} height={15} color={color} />
    </div>
  );
};

export default Boxes;
