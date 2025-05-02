// components/TruthMeter.jsx
import React from 'react';
import { RadialBarChart, RadialBar, Legend } from 'recharts';

const TruthMeter = ({ supportCount, opposeCount }) => {
  const total = supportCount + opposeCount;
  const percentage = total > 0 ? Math.round((supportCount / total) * 100) : 50;

  const data = [
    {
      name: 'Truth Score',
      value: percentage,
      fill: percentage > 75 ? '#4ade80' : percentage > 50 ? '#facc15' : '#f87171',
    },
  ];

  return (
    <div className="flex flex-col items-center mt-4">
      <h4 className="text-sm font-semibold text-gray-600">Truth Meter</h4>
      <RadialBarChart
        width={150}
        height={150}
        cx={75}
        cy={75}
        innerRadius={40}
        outerRadius={70}
        barSize={15}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar background clockWise dataKey="value" />
        <Legend
          iconSize={10}
          width={130}
          height={40}
          layout="vertical"
          verticalAlign="middle"
          wrapperStyle={{
            top: 90,
            left: 25,
            lineHeight: '24px',
          }}
        />
      </RadialBarChart>
      <div className="text-xs text-gray-500 mt-0">
        {percentage}% believe this is true
      </div>
    </div>
  );
};

export default TruthMeter;
