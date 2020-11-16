async function run(gen: AsyncGenerator) {
  let value: any;
  while (true) {
    const { value: newValue, done } = await gen.next(value);
    if (done) {
      break;
    }

    value = newValue;
  }
}

export default run;
