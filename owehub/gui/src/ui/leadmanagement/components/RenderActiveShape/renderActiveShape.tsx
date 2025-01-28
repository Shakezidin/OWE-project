import React from 'react';
import { Sector } from 'recharts';
import useMatchMedia from '../../../../hooks/useMatchMedia';

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 2;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  // Center text in pie chart
  const splitText = (text: string, width: number) => {
    const words = text.split(' ');
    const lines = [];
    let line = '';

    words.forEach((word: string) => {
      const testLine = line + word + ' ';
      if (testLine.length > width) {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    });
    lines.push(line.trim());
    return lines;
  };

  const lines = splitText(payload.name, 15);
  const isMobile = useMatchMedia('(max-width: 767px)');

  return (
    <g>
      <text
        x={cx}
        y={cy - (lines.length - 1) * 6}
        textAnchor="middle"
        fill={fill}
      >
        {lines.map((line, index) => (
          <tspan
            key={index}
            x={cx}
            dy={index ? 15 : 0}
            style={{
              fontSize: '14px',
              wordBreak: 'break-word',
              fontWeight: 550,
            }}
          >
            {line}
          </tspan>
        ))}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        style={{ fontSize: '14px' }}
      >
        {`${value}`}
      </text>
      <text
        x={
          isMobile
            ? ex + (cos >= 0 ? 1 : 1.4) * 12
            : ex + (cos >= 0 ? 1 : -1) * 12
        }
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
        style={{ fontSize: '12px' }}
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default renderActiveShape;
