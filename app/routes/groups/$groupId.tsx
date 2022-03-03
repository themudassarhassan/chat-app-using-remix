import React, { FormEventHandler } from "react";
import {
  LoaderFunction,
  Outlet,
  Form,
  ActionFunction,
  useLoaderData,
  useParams,
} from "remix";
import { User, Message, Group } from "@prisma/client";
import { requireUser } from "~/auth.server";
import { db } from "~/db.server";
import { useSocket } from "~/useSocket";

import Dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
Dayjs.extend(relativeTime);

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await requireUser(request, { redirectTo: "/login" });
  const groupId = Number(params.groupId);

  // will need to paginate these
  const messages = await db.message.findMany({ where: { groupId } });
  const group = await db.group.findUnique({ where: { id: groupId }});
  
  return {
    user,
    messages,
    group
  };
};

export default function GroupConversation() {
  const socket = useSocket();
  const { groupId } = useParams();
  const { messages: messagesFromLoader, user, group } = useLoaderData<LoaderData>();
  
  const [messages, setMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    if (!socket) return;
    socket.on("message:broadcast", message => {
      setMessages(messages => [...messages, message])
    });
  }, [socket]);

  const handleMessageSend = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      content: { value: string };
    };
    const content = target.content.value;
    
    socket?.emit("message", { content, userId: user.id, groupId: Number(groupId) });
    e.target.reset();
  };

  return (
    <>
      <div className="bg-gray-700 flex-grow flex flex-col">
        <h2 className="shadow-xl text-white px-6 py-2">{group.name}</h2>
        <div className="flex-grow flex flex-col justify-end mx-14 space-y-10">
          {[...messagesFromLoader, ...messages].map(message => <MessageItem key={message.id} {...message} />)}
        </div>
        <form
          onSubmit={handleMessageSend}
          className="flex bg-gray-400 rounded-lg mx-14 my-8"
        >
          <input
            className="bg-gray-400 flex-grow py-3 rounded-lg px-1 outline-none"
            placeholder="Type a message"
            autoComplete="off"
            type="text"
            name="content"
            required
          />
          <button
            className="bg-blue-800 text-white px-2 py-1 rounded-lg"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
      <Outlet />
    </>
  );
}

function MessageItem({ content, userId, createdAt }: Message) {
  return (
    <div className="flex">
      <img
        src="https://picsum.photos/id/1/200/300"
        className="w-10 h-10 mr-5"
        alt="user image"
      />
      <div className="flex-grow">
        <div className="flex space-x-3">
          <span className="text-gray-500 text-sm">Ali Hamza</span>
          <span className="text-gray-500 text-sm">{Dayjs(createdAt).fromNow()}</span>
        </div>
        <p className="text-white">
          {content}
        </p>
      </div>
    </div>
  );
}

type LoaderData = {
  user: User;
  messages: Message[];
  group: Group;
};
