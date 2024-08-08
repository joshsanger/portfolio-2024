import {useGlitch} from 'react-powerglitch';

export default function HoverGlitch({children, className}: {children: React.ReactNode, className?: string}) {
  const glitch = useGlitch({
    playMode: 'hover',
    slice: {
      count: 4,
      hueRotate: false,
    }
  });

  return (
    <span ref={glitch.ref} className={className}>{children}</span>
  )
}
