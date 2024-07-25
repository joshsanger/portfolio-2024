const spacing: {[key: number]: string} = {};

for (let i = 1; i <= 1680; i++) {
  spacing[i] = `${i / 16}rem`;
}

export default spacing;
