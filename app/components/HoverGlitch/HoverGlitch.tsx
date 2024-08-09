import {useGlitch} from 'react-powerglitch';

export default function HoverGlitch({children, className, count = 4}: {children: React.ReactNode, className?: string, count?: number}) {
  const glitch = useGlitch({
    playMode: 'hover',
    slice: {
      count,
      hueRotate: false,
    }
  });

  return (
    <span ref={glitch.ref} className={className}>{children}</span>
  )
}
