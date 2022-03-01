import { LoaderFunction } from "remix"

export const loader: LoaderFunction = ({ params }) => {
  console.log(`here we will load users of group with id = ${params.id}`);
  return {};
}

export default function GroupUsers() {
  return (
    <div className="bg-slate-900 text-white px-6 py-4">Users of that particular group</div>
  )
}
