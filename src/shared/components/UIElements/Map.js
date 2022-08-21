import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = props => {
  const mapRef = useRef();
  
  const { center, zoom } = props;

  useEffect(() => {
    // useEffect函数使得每次该map组件都可以根据参数变化（外部传来的中心值，和zoom缩放值发生变化时）来实时更新：
    // （每次[center, zoom]参数有变化，useEffect函数都会进行重加载）
    const map = new window.google.maps.Map(mapRef.current, {
      // google map sdk will be loaded
      center: center,
      zoom: zoom
    });
  
    new window.google.maps.Marker({ position: center, map: map });
    // 目的地在 map 中心并标记一个 marker
  }, [center, zoom]);  

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
}; 

export default Map;
