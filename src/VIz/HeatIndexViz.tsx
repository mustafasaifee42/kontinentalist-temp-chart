import { interpolateRgb, piecewise } from 'd3-interpolate';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { COLOR_SCALE } from '@/Constants';
import { useHoverActions, useHoveredItem } from '@/stores/hoverStore';
import type { DataType } from '../Types';

function HeatIndexViz({ data, radius }: { data: DataType[]; radius: number }) {
  const hoveredItem = useHoveredItem();
  const { setHoveredItem, setEventPos, setHoveredElement } = useHoverActions();
  const y = scaleLinear()
    .domain([
      Math.floor(Math.min(...data.map((row) => row.annual_hi))),
      Math.ceil(Math.max(...data.map((row) => row.annual_hi))),
    ])
    .range([0, radius / 4]);
  const heatIndexColorScale = scaleSequential()
    .domain([
      Math.floor(Math.min(...data.map((row) => row.annual_hi))),
      Math.ceil(Math.max(...data.map((row) => row.annual_hi))),
    ])
    .interpolator(piecewise(interpolateRgb, COLOR_SCALE));
  return (
    <>
      <defs>
        <marker
          id='triangle-start'
          viewBox='0 0 10 10'
          markerUnits='userSpaceOnUse'
          refX='0'
          refY='5'
          markerWidth='10'
          markerHeight='10'
          orient='auto-start-reverse'
        >
          <path d='M 0 0 L 10 5 L 0 10 z' fill='context-stroke' />
        </marker>

        <marker
          id='triangle-end'
          viewBox='0 0 10 10'
          refX='0'
          refY='5'
          markerWidth='10'
          markerHeight='10'
          markerUnits='userSpaceOnUse'
          orient='auto'
        >
          <path d='M 0 0 L 10 5 L 0 10 z' fill='context-stroke' />
        </marker>
      </defs>
      <g id='heat-index-ticks-and-label'>
        {y.ticks(3).map((tickValue, index) => (
          <g
            // biome-ignore lint/suspicious/noArrayIndexKey: this is just the ticks
            key={index}
          >
            <circle
              cx={0}
              cy={0}
              r={(radius * 2) / 5 + y(tickValue)}
              className='fill-none stroke-[#343768] stroke-[0.5px] opacity-50'
              strokeDasharray={4}
            />
            <text
              x={0}
              y={0 - ((radius * 2) / 5 + y(tickValue))}
              fill='#343768'
              textAnchor='middle'
              dy={4}
              className='text-[8px] sm:text-[10px] md:text-[12px]'
            >
              {tickValue}
            </text>
          </g>
        ))}
        <path
          id='text-path-for-heat-index-label'
          d={`M ${-radius * 0.675},0 A ${radius * 0.675},${radius * 0.675} 0 1,1 ${radius * 0.675},0 A ${radius * 0.675},${radius * 0.675} 0 1,1 ${-radius * 0.675},0`}
          fill='none'
          stroke='none'
        />
        <text>
          <textPath
            href='#text-path-for-heat-index-label'
            startOffset='25%'
            textAnchor='middle'
            className='text-xs sm:text-sm md:text-base'
          >
            Annual Heat Index
          </textPath>
        </text>
      </g>
      <g id='heat-index-bars'>
        {data.map((item, index) => (
          // biome-ignore lint/a11y/noStaticElementInteractions: This is a line tag for graph interaction
          <line
            key={item.year}
            x1={radius * 0.4 * Math.sin(index * ((2 * Math.PI) / data.length))}
            x2={
              (radius * 0.4 + y(item.annual_hi)) * Math.sin(index * ((2 * Math.PI) / data.length))
            }
            y1={-1 * radius * 0.4 * Math.cos(index * ((2 * Math.PI) / data.length))}
            y2={
              -1 *
              (radius * 0.4 + y(item.annual_hi)) *
              Math.cos(index * ((2 * Math.PI) / data.length))
            }
            strokeWidth={10}
            onMouseEnter={(e) => {
              setHoveredItem(item);
              setHoveredElement('heatIndex');
              setEventPos([e.clientX, e.clientY]);
            }}
            onMouseMove={(e) => {
              setHoveredItem(item);
              setHoveredElement('heatIndex');
              setEventPos([e.clientX, e.clientY]);
            }}
            onMouseLeave={() => {
              setHoveredItem(undefined);
              setHoveredElement(undefined);
              setEventPos(undefined);
            }}
            stroke={heatIndexColorScale(item.annual_hi)}
            markerStart='url(#triangle-start)'
            markerEnd='url(#triangle-end)'
            opacity={!hoveredItem || hoveredItem?.year === item.year ? 1 : 0.25}
          />
        ))}
      </g>
    </>
  );
}

export default HeatIndexViz;
