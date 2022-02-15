function actions(navigate, domain, openPopup) {
  return [
    {
      id: "home",
      name: "Inbox",
      shortcut: ["h"],
      keywords: "home index inbox",
      perform: () => navigate(`/channels/${domain}`),
      type: "link",
      section: "navigation",
    },
    {
      id: "createPost",
      name: "Create Post",
      shortcut: ["p"],
      keywords: "create post new",
      perform: () => openPopup({ type: "createPost", state: true, data: {noForumId: true} }),
      type: "link",
      section: "actions",
    },
    {
      id: "createChannel",
      name: "Create Channel",
      shortcut: ["c"],
      keywords: "create forum channel new",
      perform: () => openPopup({ type: "createForum", state: true }),
      type: "link",
      section: "actions",
    },
    {
      id: "settings",
      name: "Settings",
      shortcut: ["s"],
      keywords: "email",
      perform: () => console.log('You clicked on "Contact" action'),
      type: "settings",
      section: "other",
    },
  ];
}

export default actions;
