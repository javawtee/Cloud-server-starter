// The root provides a resolver function for each API endpoint
const ResolversRoot = {
  Query: {
    helloWorld: () => 'Hello world!',
  }
};

export default ResolversRoot;