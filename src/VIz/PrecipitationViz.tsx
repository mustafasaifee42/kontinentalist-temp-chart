import { scaleSqrt, scaleThreshold } from 'd3-scale';
import { PRECIPITATION_COLOR_SCALE } from '@/Constants';
import { useHoverActions, useHoveredItem } from '@/stores/hoverStore';
import type { DataType } from '../Types';

function PrecipitationViz({ data, radius }: { data: DataType[]; radius: number }) {
  const hoveredItem = useHoveredItem();
  const { setHoveredItem, setEventPos, setHoveredElement } = useHoverActions();
  const r = scaleSqrt()
    .domain([0, Math.max(...data.map((row) => row.annual_prep))])
    .range([0, 0.1 * radius])
    .nice();
  const precipitationColorScale = scaleThreshold<number, string>()
    .domain([50, 100, 150, 200])
    .range([
      'url(#gradient-0)',
      'url(#gradient-1)',
      'url(#gradient-2)',
      'url(#gradient-3)',
      'url(#gradient-4)',
    ]);
  return (
    <>
      {PRECIPITATION_COLOR_SCALE.map((color, index) => (
        <defs key={color}>
          <linearGradient x1='0%' y1='0%' x2='0%' y2='100%' id={`gradient-${index}`}>
            <stop
              offset='0%'
              stopColor={index === 0 ? color : PRECIPITATION_COLOR_SCALE[index - 1]}
              stopOpacity={0.8}
            />
            <stop offset='100%' stopColor={color} stopOpacity={1} />
          </linearGradient>
        </defs>
      ))}
      <g id='precipitation-ticks-and-label'>
        <circle
          cx={0}
          cy={0}
          r={radius * 0.8}
          className='fill-none stroke-[#343768] stroke-[0.5px] opacity-50'
          strokeDasharray={4}
        />
        <path
          id='text-path-for-precipitation-label'
          d={`M ${-radius * 0.9},0 A ${radius * 0.9},${radius * 0.9} 0 1,1 ${radius * 0.9},0 A ${radius * 0.9},${radius * 0.9} 0 1,1 ${-radius * 0.9},0`}
          fill='none'
          stroke='none'
        />
        <text>
          <textPath
            href='#text-path-for-precipitation-label'
            startOffset='25%'
            textAnchor='middle'
            className='text-xs sm:text-sm md:text-base'
          >
            Annual Precipitation
          </textPath>
        </text>
      </g>
      <g id='precipitation-circles'>
        {data.map((item, index) => (
          // biome-ignore lint/a11y/noStaticElementInteractions: This is a g tag for graph interaction
          <g
            key={item.year}
            id={`circle-${item.year}`}
            onMouseEnter={(e) => {
              setHoveredItem(item);
              setHoveredElement('precipitation');
              setEventPos([e.clientX, e.clientY]);
            }}
            onMouseMove={(e) => {
              setHoveredItem(item);
              setHoveredElement('precipitation');
              setEventPos([e.clientX, e.clientY]);
            }}
            onMouseLeave={() => {
              setHoveredItem(undefined);
              setHoveredElement(undefined);
              setEventPos(undefined);
            }}
            opacity={!hoveredItem || hoveredItem?.year === item.year ? 1 : 0.25}
            transform={`translate(${radius * 0.8 * Math.sin(index * ((2 * Math.PI) / data.length))},${-1 * radius * 0.8 * Math.cos(index * ((2 * Math.PI) / data.length))})`}
          >
            <circle
              cx={0}
              cy={0}
              r={r(item.annual_prep)}
              fill={precipitationColorScale(item.annual_prep)}
            />
            <circle
              cx={0}
              cy={0}
              r={r(item.annual_prep) + 5}
              fill='none'
              stroke='black'
              strokeWidth={1}
              opacity={hoveredItem?.year === item.year ? 1 : 0}
            />
          </g>
        ))}
      </g>
    </>
  );
}

export default PrecipitationViz;
