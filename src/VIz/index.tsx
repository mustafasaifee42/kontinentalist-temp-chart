import { useEffect, useRef, useState } from 'react';
import type { DataType } from '../Types';
import Visualization from './Visualization';

function Viz({ data, city }: { data: DataType[]; city: string }) {
  const [graphRadius, setGraphRadius] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      setGraphRadius(
        (Math.min(
          ...[entries[0].target.clientWidth || 620, entries[0].target.clientHeight || 480],
        ) || 420) / 2,
      );
    });
    if (graphDiv.current) {
      resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, []);
  return (
    <div className='flex h-screen w-full flex-col justify-center bg-linear-to-b from-white to-[#F1F6F9] p-8'>
      <div className='h-full w-full' ref={graphDiv}>
        {graphRadius ? <Visualization data={data} city={city} radius={graphRadius} /> : null}
      </div>
    </div>
  );
}

export default Viz;
