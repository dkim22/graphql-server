import { request } from "graphql-request";
import { createConnection } from "typeorm";

import { User } from "../entity/User";

const email = "kim@kim.com";
const password = "agagag";

const mutation = `
  mutation {
    register(email: "${email}", password: "${password}")
  }
`;

test("Register user", async () => {
  const response = await request("http://localhost:4000", mutation);
  expect(response).toEqual({ register: true });
  await createConnection();
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  // 패스워드 해싱 되었는지 확인
  expect(user.password).not.toEqual(password);
});
