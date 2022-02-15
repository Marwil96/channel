import actions from "../../constants/actions";
import useWorksAction from "../../lib/useWorksAction";
import { AnimatePresence, motion } from "framer-motion";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
} from "kbar";
import Results from "./Results";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "../../stitches.config";
import { useSelector } from "react-redux";

const MotionDiv = styled(motion.div, {
  backgroundColor: "rgb(255 255 255/0.8)",
  backdropFilter: "blur(4px)",
  opacity: 0.8,
  height: "100vh",
  width: "100vw",
  position: "fixed",
  top: 0,
  left: 0,
});

function InnerCommandBar() {
  useWorksAction();

  return (
    <KBarPortal>
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: 0.1,
          },
        }}
        exit={{
          opacity: 0,
          transition: {
            duration: 0.1,
          },
        }}
      />

      <KBarPositioner
        style={{
          position: "fixed",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          inset: "0px",
          padding: "14vh 16px 16px",
        }}
      >
        <KBarAnimator style={{width: '100%', maxWidth: '57.6rem', background: 'white'}}>
          <div style={{ padding: '1.6rem', borderRadius: '1.2rem', boxShadow: '0 1px 2.2px rgb(0 0 0 / 2%), 0 2.5px 5.3px rgb(0 0 0 / 3%), 0 4.6px 10px rgb(0 0 0 / 4%), 0 8.3px 17.9px rgb(0 0 0 / 4%), 0 15.5px 33.4px rgb(0 0 0 / 5%), 0 37px 80px rgb(0 0 0 / 7%)'}}>
            <KBarSearch
              style={{
                outline: "2px solid transparent",
                outlineOffset: "2px",
                padding: "1.6rem",
                backgroundColor: "rgb(250 250 250/1)",
                fontSize: '1.6rem',
                borderRadius: "0.25rem",
                width: "-webkit-fill-available",
                marginBottom: "1rem",
                border: 0,
                input: '0'
              }}
              placeholder="Search"
            />

            <div style={{marginTop: '2rem', borderTop: '1px solid rgb(229 229 229/1)'}}>
              <Results />
            </div>
          </div>
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}

export default function CommandBar({ children }) {
  const navigate = useNavigate();
  let { channelName } = useParams();


  return (
    <AnimatePresence exitBeforeEnter>
      <KBarProvider
        actions={actions(navigate, channelName)}
        options={{
          enabledHistory: true,
        }}
      >
        <InnerCommandBar />

        {children}
      </KBarProvider>
    </AnimatePresence>
  );
}
