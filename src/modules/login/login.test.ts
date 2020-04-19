import { request } from "graphql-request";
import { Connection } from "typeorm";
import { invalidLogin, confirmEmailError } from "./errorMessages";
import { User } from "../../entity/User";
import { createTypeormConn } from "../../utils/createTypeormConn";

const email = "kim22@kim.com";
const password = "agagag";

const registerMutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

const loginMutation = (e: string, p: string) => `
  mutation {
    login(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

let conn: Connection;
beforeAll(async () => {
  conn = await createTypeormConn();
});
afterAll(async () => {
  conn.close();
});

const loginExpectError = async (e: string, p: string, errMsg: string) => {
  const response2 = await request(
    process.env.TEST_HOST as string,
    loginMutation(e, p)
  );

  expect(response2).toEqual({
    login: [
        {
        path: "email",
        message: errMsg,
      }
    ]
  });
}

describe("login", () => {
  test("email not found send back error", async () => {
    await loginExpectError("kim@kimm.com", "whatever", invalidLogin);
  });

  test("email not confirmed", async () => {
    await request(
      process.env.TEST_HOST as string,
      registerMutation(email, password)
    );

    await loginExpectError(email, password, confirmEmailError);
    
    await User.update({ email }, { confirmed: true });
  
    await loginExpectError(email, "afafaf", invalidLogin);
    
    const response = await request(
      process.env.TEST_HOST as string,
      loginMutation(email, password)
    );

    expect(response).toEqual({ login: null });
  });
});

