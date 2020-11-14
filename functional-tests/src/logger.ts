let messageCount = 0;

export default (message: string) => {
  messageCount += 1;
  console.log(`\t${messageCount < 10 ? " " : ""}${messageCount}. ${message}`);
};
