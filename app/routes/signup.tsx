import { Link } from "react-router-dom";
import { ActionFunction, Form } from "remix";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  
}

export default function Signup() {
  return (
    <div className="bg-gray-300 max-w-sm px-6 py-10 mx-auto my-20 shadow-md">
      <h2 className="text-center text-2xl mb-2">Signup</h2>
      <Form method="post">
        <div className="flex flex-col mb-3">
          <label htmlFor="name">Name</label>
          <input className="bg-gray-100 rounded py-1" type="name" id="name" name="name" />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="email">Email</label>
          <input className="bg-gray-100 rounded py-1" type="email" id="email" name="email" />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="password">Password</label>
          <input className="bg-gray-100 rounded py-1" type="password" id="password" name="password" />
        </div>
        <div className="flex justify-between mt-2">
          <button className="bg-blue-800 text-white px-2 py-1  rounded" type="submit">Signup</button>
          <Link className="border-blue-800 border bg-white text-blue-800 rounded px-2 py-1 " to="/login">Login</Link>
        </div>
      </Form>
    </div>
  )
}
