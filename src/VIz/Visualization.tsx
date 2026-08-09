import type { DataType } from '../Types';
import AverageTempViz from './AverageTempViz';
import HeatIndexViz from './HeatIndexViz';
import PrecipitationViz from './PrecipitationViz';
import { Tooltip } from './Tooltip';

function Visualization({ data, radius, city }: { data: DataType[]; radius: number; city: string }) {
  const dataSorted = [...data].sort((a, b) => a.year - b.year);
  return (
    <>
      <svg
        width={`${radius * 2}px`}
        height={`${radius * 2}px`}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        className='mx-auto'
        role='img'
        aria-label='Weather graph'
      >
        <g transform={`translate(${radius}, ${radius})`}>
          <foreignObject
            y={0 - radius / 3}
            x={0 - radius / 3}
            width={2 * (radius / 3)}
            height={2 * (radius / 3)}
          >
            <div className='flex h-inherit flex-col items-center justify-center gap-0.5 px-4 py-0'>
              <p className='m-0 text-center text-base text-gray-900 uppercase sm:text-xl lg:text-4xl'>
                {city}
              </p>
            </div>
          </foreignObject>
          <g id='years-label'>
            <circle
              cx={0}
              cy={0}
              r={(radius * 4) / 5}
              className='fill-none stroke-[#343768] stroke-[0.5px] opacity-50'
              strokeDasharray={4}
            />
            <path
              id='text-path-for-years-label'
              d={`M ${-radius * 0.95},0 A ${radius * 0.95},${radius * 0.95} 0 1,1 ${radius * 0.95},0 A ${radius * 0.95},${radius * 0.95} 0 1,1 ${-radius * 0.95},0`}
              fill='none'
              stroke='none'
            />
            {dataSorted.map((item, index) => (
              <text
                key={item.year}
                fill='#343768'
                textAnchor='middle'
                dy={4}
                className='text-[8px] sm:text-[10px] md:text-[12px]'
              >
                <textPath
                  href='#text-path-for-years-label'
                  startOffset={`${((index / dataSorted.length) * 100 + 25) % 100}%`}
                  textAnchor='middle'
                >
                  {item.year}
                </textPath>
              </text>
            ))}
          </g>
          <PrecipitationViz data={dataSorted} radius={radius} />
          <HeatIndexViz data={dataSorted} radius={radius} />
          <AverageTempViz data={dataSorted} radius={radius} />
        </g>
      </svg>
      <Tooltip />
    </>
  );
}

export default Visualization;
