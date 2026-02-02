import React from 'react';
import './CategoryChart.css';

const CategoryChart = ({ categories }) => {
    // Calculate total and percentages
    const total = Object.values(categories).reduce((sum, val) => sum + val, 0);
    
    const categoryData = Object.entries(categories).map(([name, value]) => ({
        name,
        value,
        percentage: ((value / total) * 100).toFixed(0)
    }));

    // Sort by value descending
    categoryData.sort((a, b) => b.value - a.value);

    // Colors for the pie chart
    const colors = [
        '#fbbf24', // yellow/orange (Income)
        '#22c55e', // green (Rent)
        '#ef4444', // red (Food)
        '#5843be', // blue (Coaching)
        '#ec4899', // pink
        '#8b5cf6', // purple
        '#14b8a6', // teal
        '#f97316', // orange
    ];

    // Calculate pie chart segments
    let currentAngle = 0;
    const segments = categoryData.map((cat, index) => {
        const angle = (cat.value / total) * 360;
        const segment = {
            ...cat,
            startAngle: currentAngle,
            endAngle: currentAngle + angle,
            color: colors[index % colors.length]
        };
        currentAngle += angle;
        return segment;
    });

    // Convert to SVG path
    const createArcPath = (centerX, centerY, radius, startAngle, endAngle) => {
        const start = polarToCartesian(centerX, centerY, radius, endAngle);
        const end = polarToCartesian(centerX, centerY, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

        return [
            'M', centerX, centerY,
            'L', start.x, start.y,
            'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            'Z'
        ].join(' ');
    };

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    return (
        <div className="category-chart-container">
            <h2>Breakdown by Category</h2>
            
            <div className="chart-content">
                <div className="pie-chart">
                    <svg viewBox="0 0 200 200" className="pie-svg">
                        {segments.map((segment, index) => (
                            <g key={index}>
                                <path
                                    d={createArcPath(100, 100, 80, segment.startAngle, segment.endAngle)}
                                    fill={segment.color}
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            </g>
                        ))}
                    </svg>
                </div>

                <div className="chart-legend">
                    {segments.map((segment, index) => (
                        <div key={index} className="legend-item">
                            <span 
                                className="legend-color" 
                                style={{ backgroundColor: segment.color }}
                            ></span>
                            <span className="legend-label">
                                {segment.name} ({segment.percentage}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryChart;