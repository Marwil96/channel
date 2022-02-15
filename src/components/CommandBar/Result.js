import { ArrowRightIcon, GearIcon } from "@radix-ui/react-icons";
import { useEffect, useRef } from "react";

export default function Result({ item, active, highlight }) {
  const ref = useRef(null);

  useEffect(() => {
    if (active && ref?.current) {
      highlight(ref);
    }
  }, [active]);

  return typeof item === "string" ? (
    <span
      className="text-neutral-500 text-sm capitalize flex items-center h-12"
      style={{
        height: "4.8rem",
        fontSize: "1.4rem",
        textTransform: "capitalize",
        color: "rgb(115, 115, 115)",
        lineHeight: "2rem",
        display: "flex",
        alignItems: "center",
        borderRadius: "0.4rem",
      }}
    >
      {item}
    </span>
  ) : (
    <div
      ref={ref}
      className="h-12 rounded flex items-center cursor-pointer"
      style={{
        height: "4.8rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        borderRadius: "0.4rem",
      }}
    >
      <span className="pl-2 inline-flex gap-2 items-center"
        style={{paddingLeft: '0.8rem', gap: '0.8rem', alignItems: 'center', display: 'inline-flex'}}
      >
        {item?.type === "link" && <ArrowRightIcon />}
        {item?.type === "settings" && <GearIcon />}

        {item.name}
      </span>
    </div>
  );
}
