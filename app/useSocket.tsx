import React from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { connect } from "./ws.client";

const SocketContext = React.createContext<Socket<DefaultEventsMap, DefaultEventsMap> | undefined>(undefined);

function useSocket() {
  const context = React.useContext(SocketContext);
  // if (context === undefined) throw new Error("useSocket must be used inside SocketProvider");

  return context;
}

function SocketProvider({ children }) {
  const [socket, setSocket] =
    React.useState<Socket<DefaultEventsMap, DefaultEventsMap>>();

  React.useEffect(() => {
    let connection = connect();
    setSocket(connection);
    return () => {
      connection.close();
    };
  }, []);

  React.useEffect(() => {
    if (!socket) return;
    socket.on("event", data => {
      console.log(data);
    });
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export { useSocket, SocketProvider };
