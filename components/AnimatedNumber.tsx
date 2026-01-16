'use client';

import { useEffect, useRef } from 'react';
import CountUp from 'react-countup';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export default function AnimatedNumber({ 
  value, 
  prefix = '', 
  suffix = '', 
  decimals = 2,
  className = ''
}: AnimatedNumberProps) {
  const prevValue = useRef(0);

  useEffect(() => {
    prevValue.current = value;
  }, [value]);

  return (
    <CountUp
      start={prevValue.current}
      end={value}
      duration={1.5}
      decimals={decimals}
      decimal="."
      prefix={prefix}
      suffix={suffix}
      className={className}
      separator=","
      preserveValue
    />
  );
}