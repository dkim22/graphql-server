import { request } from "graphql-request";
import { AddressInfo } from "net";
import { startServer } from "../../startServer";
import { User } from "../../entity/User";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} from "./errorMessages";

let getHost = () => "";

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address() as AddressInfo;
  getHost = () => `http://127.0.0.1:${port}`;
});

const email = "kim@kim.com";
const password = "agagag";

const mutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

test("Register user", async () => {
  // 유저 등록 가능한지 테스트
  const response = await request(getHost(), mutation(email, password));
  expect(response).toEqual({ register: null });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  // 패스워드 해싱 되었는지 확인
  expect(user.password).not.toEqual(password);

  // 중복된 이메일인지 테스트
  const response2 = await request(getHost(), mutation(email, password));
  expect(response2.register).toHaveLength(1);
  expect(response2.register[0]).toEqual({
    path: "email",
    message: duplicateEmail,
  });

  // 잘못된 이메일인지 테스트
  const response3 = await request(getHost(), mutation("b", password));
  expect(response3).toEqual({
    register: [
      {
        path: "email",
        message: emailNotLongEnough,
      },
      {
        path: "email",
        message: invalidEmail,
      },
    ],
  });

  // 잘못된 패스워드 인지 테스트
  const response4 = await request(getHost(), mutation(email, "ad"));
  expect(response4).toEqual({
    register: [
      {
        path: "password",
        message: passwordNotLongEnough,
      },
    ],
  });

  // 잘못된 패스워드와 이메일 인지 테스트
  const response5 = await request(getHost(), mutation("df", "ad"));
  expect(response5).toEqual({
    register: [
      {
        path: "email",
        message: emailNotLongEnough,
      },
      {
        path: "email",
        message: invalidEmail,
      },
      {
        path: "password",
        message: passwordNotLongEnough,
      },
    ],
  });
});
