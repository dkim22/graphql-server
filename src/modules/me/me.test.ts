import axios from "axios";
import { Connection } from "typeorm";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../entity/User";

let userId: string;
let conn: Connection;
const email = "kim3@kim.com";
const password = "asdasdasd11";

beforeAll(async () => {
  conn = await createTypeormConn();
  const user = await User.create({
    email,
    password,
    confirmed: true,
  }).save();
  userId = user.id;
});

afterAll(async () => {
  conn.close();
});

const loginMutation = (e: string, p: string) => `
  mutation {
    login(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

const meQuery = `
  {
    me {
      id
      email
    }
  }
`;

describe("me", () => {
  // test("can't get user if not logged in", async () => {
  //   // later
  // });

  test("get current user", async () => {
    await axios.post(
      process.env.TEST_HOST as string,
      {
        query: loginMutation(email, password),
      },
      {
        withCredentials: true,
      },
    );

    const responese = await axios.post(
        process.env.TEST_HOST as string,
        {
          query: meQuery
        },
        {
          withCredentials: true,
        },
      );

      expect(responese.data.data).toEqual({
        me: {
          id: userId,
          email,
        }
      });
  });
});
