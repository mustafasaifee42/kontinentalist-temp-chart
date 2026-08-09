import { interpolateRgb, piecewise } from 'd3-interpolate';
import { scaleSequential } from 'd3-scale';
import { arc, type PieArcDatum, pie } from 'd3-shape';
import { COLOR_SCALE } from '@/Constants';
import { useHoverActions, useHoveredItem } from '@/stores/hoverStore';
import type { DataType } from '../Types';

function AverageTempViz({ data, radius }: { data: DataType[]; radius: number }) {
  const hoveredItem = useHoveredItem();
  const { setHoveredItem, setEventPos, setHoveredElement } = useHoverActions();
  const avgTempColorScale = scaleSequential()
    .domain([
      Math.floor(Math.min(...data.map((row) => row.annual_temp))),
      Math.ceil(Math.max(...data.map((row) => row.annual_temp))),
    ])
    .interpolator(piecewise(interpolateRgb, COLOR_SCALE));
  const pieData = pie<DataType>()
    .sort(null)
    .startAngle(-Math.PI / data.length)
    .endAngle(2 * Math.PI - Math.PI / data.length)
    .padAngle(0.01)
    .value((_d: DataType) => 1);

  const arcGenerator = arc<PieArcDatum<DataType>>()
    .innerRadius(radius * 0.3 - 15)
    .outerRadius(radius * 0.3);
  return (
    <>
      <g id='avg-temp-ticks-and-label'>
        <path
          id='text-path-for-avg-temp-label'
          d={`M ${-radius * 0.325},0 A ${radius * 0.325},${radius * 0.325} 0 1,1 ${radius * 0.325},0 A ${radius * 0.325},${radius * 0.325} 0 1,1 ${-radius * 0.325},0`}
          fill='none'
          stroke='none'
        />
        <text>
          <textPath
            href='#text-path-for-avg-temp-label'
            startOffset='25%'
            textAnchor='middle'
            className='text-xs sm:text-sm md:text-base'
          >
            Annual Average Temperature
          </textPath>
        </text>
      </g>
      <g id='avg-temp-bars'>
        {pieData(data).map((item) => (
          // biome-ignore lint/a11y/noStaticElementInteractions: This is a path tag for graph interaction
          <path
            key={item.data.year}
            d={arcGenerator(item) ?? ''}
            fill={avgTempColorScale(item.data.annual_temp)}
            onMouseEnter={(e) => {
              setHoveredItem(item.data);
              setHoveredElement('avgTemp');
              setEventPos([e.clientX, e.clientY]);
            }}
            onMouseMove={(e) => {
              setHoveredItem(item.data);
              setHoveredElement('avgTemp');
              setEventPos([e.clientX, e.clientY]);
            }}
            onMouseLeave={() => {
              setHoveredItem(undefined);
              setHoveredElement(undefined);
              setEventPos(undefined);
            }}
            stroke='#000'
            strokeWidth={hoveredItem?.year === item.data.year ? 2 : 0}
            opacity={!hoveredItem || hoveredItem?.year === item.data.year ? 1 : 0.25}
          />
        ))}
      </g>
    </>
  );
}

export default AverageTempViz;
