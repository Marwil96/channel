function actions(navigate, domain) {
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
      perform: () => console.log('You clicked on "Contact" action'),
      type: "link",
      section: "actions",
    },
    {
      id: "createChannel",
      name: "Create Channel",
      shortcut: ["c"],
      keywords: "create forum channel new",
      perform: () => console.log('You clicked on "Contact" action'),
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
