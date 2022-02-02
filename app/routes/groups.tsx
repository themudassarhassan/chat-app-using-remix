import { LoaderFunction, Outlet } from "remix";

export const loader: LoaderFunction = () => {
  console.log('here we will load all groups (ofcourse will apply pagination)');
  return {};
} 

export default function Groups() {
  return (
    <div>
      <div>Groups layout: Side Bar to show groups</div>
      <Outlet />
    </div>
  )
}
