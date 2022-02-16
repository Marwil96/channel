import { mauve } from "@radix-ui/colors";
import { ArrowRightIcon, GearIcon } from "@radix-ui/react-icons";
import { useEffect, useRef } from "react";
import { styled } from "../../stitches.config";

const RightSlot = styled("div", {
  marginLeft: "auto",
  // height: "100%",
  alignSelf: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "1rem 0rem",
  width: '4rem',
  background: "#f1f1f1",
  borderRadius: '0.4rem',
  color: mauve.mauve11,
  ":focus > &": { color: "$text" },
  "[data-disabled] &": { color: mauve.mauve8 },
});

export default function Result({ item, active, highlight }) {
  const ref = useRef(null);

  useEffect(() => {
    if (active && ref?.current) {
      highlight(ref);
    }
  }, [active]);

  return typeof item === "string" ? (
    <span
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
      style={{
        height: "4.8rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        borderRadius: "0.4rem",
      }}
    >
      <span
        style={{
          paddingLeft: "0.8rem",
          gap: "0.8rem",
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        {item?.type === "link" && <ArrowRightIcon />}
        {item?.type === "settings" && <GearIcon />}

        {item.name}
      </span>
      {item?.shortcut !== undefined && item?.shortcut.length > 0 && (
        <RightSlot>{item?.shortcut}</RightSlot>
      )}
    </div>
  );
}
