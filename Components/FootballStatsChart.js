import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const FootballStatsChart = ({ title = "Player Performance Metrics" }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';
  const labelColor = isDark ? '#F5F4F2' : '#161513';
  const gridColor = isDark ? 'rgba(245, 244, 242, 0.18)' : 'rgba(110, 107, 104, 0.2)';

  const data = {
    labels: ['Goals', 'Assists', 'Passing Accuracy', 'Successful Dribbles', 'Interceptions', 'Aerial Duels'],
    datasets: [
      {
        label: 'Current Season',
        data: [85, 70, 92, 88, 45, 60],
        backgroundColor: 'rgba(199, 70, 52, 0.2)',
        borderColor: 'rgba(199, 70, 52, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(199, 70, 52, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(199, 70, 52, 1)',
      },
      {
        label: 'League Average',
        data: [60, 50, 75, 65, 55, 50],
        backgroundColor: isDark ? 'rgba(184, 180, 176, 0.22)' : 'rgba(110, 107, 104, 0.2)',
        borderColor: isDark ? 'rgba(184, 180, 176, 0.9)' : 'rgba(110, 107, 104, 1)',
        borderWidth: 2,
        pointBackgroundColor: isDark ? 'rgba(184, 180, 176, 1)' : 'rgba(110, 107, 104, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: isDark ? 'rgba(184, 180, 176, 1)' : 'rgba(110, 107, 104, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: gridColor,
        },
        grid: {
          color: gridColor,
        },
        pointLabels: {
          color: labelColor,
          font: {
            size: 12,
            weight: '600'
          }
        },
        ticks: {
          display: false,
          precision: 0,
          max: 100,
          min: 0,
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: labelColor,
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(22, 21, 19, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderColor: 'rgba(199, 70, 52, 0.3)',
        borderWidth: 1,
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-full min-h-[400px] p-6 bg-white dark:bg-[#161513] rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] shadow-sm">
      <h3 className="text-xl font-bold mb-6 text-center text-[#161513] dark:text-[#F5F4F2]" style={{ fontFamily: "Charter, Georgia, serif" }}>
        {title}
      </h3>
      <div className="h-[350px]">
        <Radar key={isDark ? 'dark' : 'light'} data={data} options={options} />
      </div>
      <p className="mt-6 text-xs text-center text-[#6E6B68] dark:text-[#B8B4B0]">
        Interactive Data Visualization Example — Powered by Chart.js
      </p>
    </div>
  );
};

export default FootballStatsChart;
