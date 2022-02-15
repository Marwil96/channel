import { useRegisterActions } from "kbar";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { generateKey } from "./helpers";

const searchId = generateKey();

export default function useWorksAction() {
  const navigate = useNavigate();
  const { allForums } = useSelector((state) => state.DatabaseReducer);
  const [results, setResults] = useState(allForums);

  useEffect(() => {
    setResults(allForums)
  }, [allForums])

  const defaultAction = useMemo(() => {
    return {
      id: searchId,
      name: "Search channels...",
      shortcut: ["?"],
      keywords: "channels find search",
      section: "Channels",
    };
  }, []);

  // useEffect(() => {
  //   fetch("/api/works").then((response) => {
  //     response.json().then(({ data }) => {
  //       setResults([...data]);
  //     });
  //   });
  // }, []);

  const searchActions = useMemo(() => {
    if (!results) {
      return null;
    }

    return results.map(({ title, id }) => {
      return {
        id: generateKey(),
        parent: searchId,
        name:title,
        shortcut: [],
        section: "Channels",
        keywords: [title, id],
        perform: () => navigate(`/channels/gmail.com/${id}`),
      };
    });
  }, [results, navigate]);

  const rootWorksAction = useMemo(
    () => (searchActions?.length ? defaultAction : null),
    [searchActions, defaultAction]
  );

  const actions = useMemo(() => {
    if (!rootWorksAction) {
      return defaultAction;
    }

    return [rootWorksAction, ...searchActions];
  }, [rootWorksAction, searchActions, defaultAction]);

  useRegisterActions(actions, [actions]);
}
