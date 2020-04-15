import "reflect-metadata";
import { importSchema } from "graphql-import";
import { GraphQLServer } from "graphql-yoga";
import { createConnection } from "typeorm";
import * as path from "path";

import { resolvers } from "./resolvers";

export const startServer = async () => {
  const typeDefs = importSchema(path.join(__dirname, "./schema.graphql"));

  const server = new GraphQLServer({ typeDefs, resolvers });
  await createConnection();
  await server.start();
  console.log("Server is running on localhost:4000");
};

startServer();

// 1. 테스트 데이터 베이스 구현
// 2. 테스트 후에 모든 데이터 비울 것
// 3. yarn test 실행시 서버도 같이 실행 할 것
