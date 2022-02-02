import { LoaderFunction } from "remix"

export const loader: LoaderFunction = ({ params }) => {
  console.log(`here we will load users of group with id = ${params.id}`);
  return {};
}

export default function GroupUsers() {
  return (
    <div>Users of that particular group</div>
  )
}
