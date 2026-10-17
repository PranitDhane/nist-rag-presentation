import { useEffect, useState } from "react";
import { getHealth } from "../api/client.js";

/** "checking" | "online" | "offline", refreshed every 30 s. */
export function useHealth() {
  const [state, setState] = useState("checking");
  useEffect(() => {
    let alive = true;
    const check = () => getHealth().then((ok) => alive && setState(ok ? "online" : "offline"), () => alive && setState("offline"));
    check();
    const t = setInterval(check, 30000);
    return () => { alive = false; clearInterval(t); };
  }, []);
  return state;
}
