import { createPortal } from 'react-dom';
import { useEventPos, useHoveredElement, useHoveredItem } from '@/stores/hoverStore';
export function Tooltip() {
  const hoveredItem = useHoveredItem();
  const eventPos = useEventPos();
  const hoveredElement = useHoveredElement();
  if (!hoveredItem || !eventPos) return null;
  const [xPos, yPos] = eventPos;
  return createPortal(
    <div
      className='fixed z-1000 block bg-gray-700/70 p-2'
      style={{
        top: `${yPos < window.innerHeight / 2 ? yPos : yPos + 10}px`,
        left: `${xPos > window.innerWidth / 2 ? xPos - 10 : xPos + 10}px`,
        transform: `translate(${
          xPos > window.innerWidth / 2 ? '-100%' : '0%'
        },${yPos > window.innerHeight / 2 ? '-100%' : '0%'})`,
      }}
    >
      <div className='text-sm text-white leading-relaxed'>
        Year: {hoveredItem.year}
        {hoveredElement === 'avgTemp' && (
          <>
            <br />
            Average Temp: {hoveredItem.annual_temp} °C
          </>
        )}
        {hoveredElement === 'heatIndex' && (
          <>
            <br />
            Heat Index: {hoveredItem.annual_hi} °C
          </>
        )}
        {hoveredElement === 'precipitation' && (
          <>
            <br />
            Precipitation: {hoveredItem.annual_prep} mm
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
