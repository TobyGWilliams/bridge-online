async function run(gen: AsyncGenerator) {
  let value: any;
  while (true) {
    const { value: newValue, done, ...props } = await gen.next(value);

    if (done) {
      break;
    }

    if (Boolean(newValue) && typeof newValue.then === "function") {
      value = await newValue;
    } else {
      value = newValue;
    }
  }
}

export default run;
