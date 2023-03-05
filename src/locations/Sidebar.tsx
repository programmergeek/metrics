import React, { useEffect, useState } from "react";
import { List, ListItem, Note } from "@contentful/f36-components";
import { SidebarExtensionSDK } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";

const CONTENT_FIELD_ID = "Body";
const WORDS_PER_MINUTE = 238;

const Sidebar = () => {
  const sdk = useSDK<SidebarExtensionSDK>();

  const contentField = sdk.entry.fields[CONTENT_FIELD_ID];

  const [blogText, updateBlogText] = useState(contentField.getValue());

  // listen for onChange events and update the value
  useEffect(() => {
    const detach = contentField.onValueChanged((value) => {
      updateBlogText(value);
    });
    return () => detach();
  }, [contentField]);

  // reading time calculator
  const readingTime = (text: string): { words: number; text: string } => {
    const wordCount = text.split(" ").length; // Assume that the number of words is equal to the number of spaces
    const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
    return {
      words: wordCount,
      text: `${minutes} min read`,
    };
  };

  // caluculate the metrics based on the new value
  const stats = readingTime(blogText || "");

  return (
    <>
      <Note style={{ marginBottom: "12px" }}>
        Metrics for your blog post:
        <List style={{ marginTop: "12px" }}>
          <ListItem>Word count: {stats.words}</ListItem>
          <ListItem>Reading time: {stats.text}</ListItem>
        </List>
      </Note>
    </>
  );
};

export default Sidebar;
