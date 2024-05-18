import React from 'react';

interface BoxProps {
  width: number;
  height: number;
  color: string;
  borderRadius?: number; // Added borderRadius prop
}

const Box: React.FC<BoxProps> = ({
  width,
  height,
  color,
  borderRadius = 0,
}) => {
  const boxStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: color,
    borderRadius: `${borderRadius}px`, // Setting border radius
  };

  return <div style={boxStyle}></div>;
};

interface BoxesProps {
  color: string;
}

const Boxes: React.FC<BoxesProps> = ({ color }) => {
  return (
    <div>
      <Box width={15} height={15} color={color} borderRadius={3} />
    </div>
  );
};

export default Boxes;
