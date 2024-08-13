export default {
  wave: {
    '0%, 100%': {
      transform: 'translateX(-50%) rotate(-20deg)',
    },
    '50%': {
      transform: 'translateX(50%) rotate(20deg)',
    },
  },
  'reveal': {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0px)',
    },
  },
  'fade-in': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
};
