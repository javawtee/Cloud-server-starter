import { gql } from 'apollo-server-express';

const TypeDefsRoot = gql`
  type Query {
    helloWorld: String
  }
`;

export default TypeDefsRoot;