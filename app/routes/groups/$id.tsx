import { LoaderFunction, Outlet } from "remix";

export const loader: LoaderFunction = ({ params }) => {
  console.log(`here we will load messages of group with id = ${params.id}`);
  return {};
}

export default function GroupConversation() {
  return (
    <div>
      Conversation of selected group
      <Outlet />
    </div>
  )
}
