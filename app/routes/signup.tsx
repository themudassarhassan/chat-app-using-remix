import {
  ActionFunction,
  Form,
  json,
  redirect,
  useActionData,
  Link,
} from "remix";
import { register } from "~/auth.server";

export const action: ActionFunction = async ({ request }) =>
  register(request, { redirect: "/groups" });

export default function Signup() {
  const actionData = useActionData();

  return (
    <div className="bg-gray-300 max-w-sm px-6 py-10 mx-auto my-20 shadow-md">
      <h2 className="text-center text-2xl mb-2">Signup</h2>
      <Form method="post">
        <div className="flex flex-col mb-3">
          <label htmlFor="name">Name</label>
          <input
            className="bg-gray-100 rounded py-1"
            type="name"
            id="name"
            name="name"
            required
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="email">Email</label>
          <input
            className="bg-gray-100 rounded py-1"
            type="email"
            id="email"
            name="email"
            required
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="password">Password</label>
          <input
            className="bg-gray-100 rounded py-1"
            type="password"
            id="password"
            name="password"
            required
          />
        </div>
        {actionData ? <p className="text-red-400 text-md">{actionData}</p> : <>&nbsp;</>}
        
        <div className="flex justify-between mt-2">
          <button
            className="bg-blue-800 text-white px-2 py-1  rounded"
            type="submit"
          >
            Signup
          </button>
          <Link
            className="border-blue-800 border bg-white text-blue-800 rounded px-2 py-1 "
            to="/login"
          >
            Login
          </Link>
        </div>
      </Form>
    </div>
  );
}
