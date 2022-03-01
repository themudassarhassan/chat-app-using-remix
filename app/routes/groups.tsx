import {
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
  Link,
  Form,
  ActionFunction,
  json,
  useTransition,
} from "remix";
import { requireUser } from "~/auth.server";
import { Group, User } from "@prisma/client";
import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuPopover,
  MenuLink,
} from "@reach/menu-button";

import menuStyles from "@reach/menu-button/styles.css";
import dialogStyles from "@reach/dialog/styles.css";
import React from "react";
import Dialog from "@reach/dialog";
import { db } from "~/db.server";

export function links() {
  return [
    { rel: "stylesheet", href: menuStyles },
    { rel: "stylesheet", href: dialogStyles },
  ];
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request, { redirectTo: "/login" });

  const groups = await db.group.findMany();

  return {
    groups,
    user,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const name = formData.get("groupName");
  const description = formData.get("description");

  if (typeof name !== "string")
    throw json("name is not valid", { status: 400 });

  if (typeof description !== "string") {
    throw json("description is not valid", { status: 400 });
  }

  const group = await db.group.create({ data: { name, description }});

  return redirect(`/groups/${group.id}`);

};

export default function Groups() {
  const { groups, user } = useLoaderData<LoaderData>();

  return (
    <div className="flex">
      <SideBar groups={groups} user={user} />
      <Outlet />
    </div>
  );
}

function SideBar({ groups, user }: { groups: Group[]; user: User }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const transition = useTransition();

  const isCreating =
    transition.submission?.formData.get("_action") === "create" ? true : false;

  React.useEffect(() => {
    if (!isCreating) {
      closeModal();
    }
  }, [isCreating]);

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="bg-slate-900 text-white h-screen flex flex-col justify-between">
      <div className="flex justify-between px-6 py-4">
        <h3>Groups</h3>
        <button
          onClick={() => setIsOpen(true)}
          aria-label="new channel"
          className="bg-slate-700 rounded-md px-2"
        >
          +
        </button>
        <Dialog
          aria-label="Create Group Modal"
          className="rounded-md shadow-sm"
          isOpen={isOpen}
          onDismiss={closeModal}
        >
          <Form method="post">
            <div className="flex flex-col mb-3">
              <label htmlFor="groupName">Group Name</label>
              <input
                className="bg-gray-200 rounded py-1 px-2"
                type="text"
                id="groupName"
                name="groupName"
                required
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col mb-3">
              <label htmlFor="description">Description</label>
              <textarea
                required
                className="bg-gray-200 rounded py-1 px-2"
                name="description"
                id="description"
              />
            </div>
            <div className="flex justify-between mb-3">
              {isCreating ? (
                <LoadingDots />
              ) : (
                <button
                  name="_action"
                  value="create"
                  className="bg-indigo-800 text-white p-2 rounded"
                  type="submit"
                >
                  Create
                </button>
              )}
              <button
                onClick={closeModal}
                className="bg-red-800 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </Form>
        </Dialog>
      </div>
      <nav className="flex-grow px-6">
        <ul>
          {groups.map(group => (
            <li key={group.id} className="flex items-center mt-6">
              <span className="bg-slate-700 rounded-md p-1 mr-2">FD</span>
              <Link prefetch="intent" to={`/groups/${group.id}`}>
                {group.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Menu>
        <MenuButton className="bg-slate-800 text-white flex justify-between px-6 py-4 items-center">
          <span>{user.name}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chevron-up"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
            />
          </svg>
        </MenuButton>
        <MenuList className="">
          <MenuItem onSelect={() => {}}>
            <Form method="post" action="/logout">
              <button type="submit">Logout</button>
            </Form>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}

function LoadingDots() {
  let [dots, setDots] = React.useState(1);

  React.useEffect(() => {
    const interval = setInterval(() => setDots(d => d + 1), 250);
    return () => clearInterval(interval);
  }, []);

  return <span className="text-4xl text-green-800">{Array.from({ length: dots % 5 }).fill(".")}</span>;
}

type LoaderData = {
  groups: Group[];
  user: User;
};
