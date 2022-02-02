import { ActionFunction, Form, json, Link, redirect } from "remix";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  
  const email = formData.get('email');
  const password = formData.get('password');
 
  if (typeof email !== "string") throw json("email is not valid", { status: 400 });
  if (typeof password !== "string") throw json("password is not valid", { status: 400 });
  
 
  
  return redirect('/login')
};

export default function Login() {
  return (
    <div className="bg-gray-300 max-w-sm px-6 py-10 mx-auto my-20 shadow-md">
      <h2 className="text-center text-2xl mb-2">Login</h2>
      <Form method="post">
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
        <div className="flex justify-between mt-2">
          <button
            className="bg-blue-800 text-white px-2 py-1  rounded"
            type="submit"
          >
            Login
          </button>
          <Link
            className="border-blue-800 border bg-white text-blue-800 rounded px-2 py-1 "
            to="/signup"
          >
            Signup
          </Link>
        </div>
      </Form>
    </div>
  );
}
