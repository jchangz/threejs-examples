function generateArr(length: number, min: number, max: number) {
  return Array.from(
    { length },
    () => Math.floor(Math.random() * max) + min
  ).sort();
}

export { generateArr };