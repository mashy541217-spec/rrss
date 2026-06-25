import React, { useRef, useState } from 'react';

interface VirtualTableProps<T> {
  data: T[];
  itemHeight: number;
  containerHeight: number;
  renderRow: (item: T, index: number) => React.ReactNode;
  header: React.ReactNode;
}

export function VirtualTable<T>({ data, itemHeight, containerHeight, renderRow, header }: VirtualTableProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const totalHeight = data.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2);
  const endIndex = Math.min(data.length - 1, Math.floor((scrollTop + containerHeight) / itemHeight) + 2);

  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    if (data[i]) {
      visibleItems.push({
        item: data[i],
        index: i,
        offsetTop: i * itemHeight,
      });
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
      {header}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          height: containerHeight,
          overflowY: 'auto',
          position: 'relative',
          width: '100%',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div style={{ height: totalHeight, width: '100%', position: 'relative' }}>
          {visibleItems.map(({ item, index, offsetTop }) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: offsetTop,
                left: 0,
                right: 0,
                height: itemHeight,
                width: '100%',
              }}
            >
              {renderRow(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
