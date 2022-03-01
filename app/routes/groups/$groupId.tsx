import { LoaderFunction, Outlet, Form, ActionFunction } from "remix";
import { requireUser } from "~/auth.server";

export const loader: LoaderFunction = async ({ params }) => {
  return {};
};

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUser(request, { redirectTo: "/login" });
  const formData = await request.formData();
  const message = formData.get("message");


  return null;
};

export default function GroupConversation() {

  return (
    <>
      <div className="bg-gray-700 flex-grow flex flex-col justify-between">
        <h2 className="shadow-xl text-white px-6 py-2">Front-end Developers</h2>
        {/* conversation here */}
        <Form method="post" className="flex bg-gray-400 rounded-lg mx-14 mb-8">
          <input
            className="bg-gray-400 flex-grow py-3 rounded-lg px-1 outline-none"
            placeholder="Type a message"
            autoComplete="off"
            type="text"
            name="message"
            required
          />
          <button
            className="bg-blue-800 text-white px-2 py-1 rounded-lg"
            type="submit"
          >
            Send
          </button>
        </Form>
      </div>
      <Outlet />
    </>
  );
}
