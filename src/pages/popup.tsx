import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Data,
  findIndex,
  findData,
  getData,
  setData,
  sendMessage,
  removeDatas,
} from "lib/chrome_util";
import styled from "styled-components";

type Step = "normal" | "stocked" | "copied" | "removed";

const message = (step: Step) => {
  switch (step) {
    case "stocked":
      return "このページをストックしました";
    case "copied":
      return "クリップボードにまとめました。";
    case "removed":
      return "読んだものを削除しました。";
    default:
      return "";
  }
};

const Popup: React.FC = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [comment, setComment] = useState("");
  const [step, setStep] = useState<Step>("normal");

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const tab = tabs[0];
      setTitle(tab.title || "不明なページ");
      setUrl(tab.url || "unknown");
      getData((items) => {
        const datas = (items.data || []) as Data[];
        const data = findData(datas, tab.url || "unknown");
        if (data) {
          setComment(data.comment);
        }
      });
    });
  }, []);

  const onClickSaveButton = () => {
    getData((items) => {
      const datas = (items.data || []) as Data[];
      let newData = findData(datas, url);
      if (newData) {
        newData.comment = comment;
        datas[findIndex(datas, url)] = newData;
      } else {
        newData = {
          title,
          comment,
          url,
          created_at: new Date().toString(),
        };
        datas.push(newData);
      }
      items.data = datas;
      setData(items, () => {
        setStep("stocked");
        newData = newData as Data;
        sendMessage({
          md: `[${newData.title}](${newData.url})${newData.comment}\n`,
          closeWindow: false,
        });
      });
    });
  };

  const onClickCopyButton = () => {
    getData((items) => {
      const datas = (items.data || []) as Data[];
      const md = datas.reduce((result, item) => {
        if (item.comment !== "") {
          return `${result}- [${item.title}](${item.url})\n${item.comment}\n`;
        } else {
          return `${result}- [${item.title}](${item.url})\n`;
        }
      }, "");
      sendMessage({ md: md });
      removeDatas();
      setStep("copied");
    });
  };

  const onClickRemoveButton = () => {
    removeDatas();
    setStep("removed");
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>nippoly</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link href="style/popup.css" rel="stylesheet" />
      </Head>
      <Container>
        <Box>
          <Title>TITLE</Title>
          <BoxContent>
            <Input
              id="page-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </BoxContent>
        </Box>
        <Box>
          <Title>COMMENT</Title>
          <BoxContent>
            <Textarea
              id="page-comment"
              rows={4}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </BoxContent>
        </Box>
        <Box>
          <Title>URL</Title>
          <BoxContent>
            <Url>{url}</Url>
          </BoxContent>
        </Box>
        <hr />
        <ButtonContainer>
          <MenuButton onClick={onClickSaveButton}>読んだ！</MenuButton>
          <MenuButton onClick={onClickCopyButton}>まとめる！</MenuButton>
          <MenuButton onClick={onClickRemoveButton}>削除する！</MenuButton>
        </ButtonContainer>
        {step !== "normal" ? (
          <MessageContainer>
            <IconImage src="icon.png" />
            <Message>{message(step)}</Message>
          </MessageContainer>
        ) : null}
      </Container>
    </>
  );
};

const Container = styled.div`
  margin: 0;
  padding: 8px 4px;
  box-sizing: border-box;
  width: 300px;
  color: #222;
  font-family: "Noto Sans JP", sans-serif;
  font-weight: 500;
  border: 5px solid #444444;
  border-radius: 12px;
  display: flex;
  flex-flow: column;
`;

const Box = styled.div`
  margin: 8px;
  width: calc("100%" - "16px");
`;

const Title = styled.span`
  font-weight: bold;
  font-size: 14px;
`;

const BoxContent = styled.div`
  margin: 8px 16px;
  margin-bottom: 0px;
  width: calc("100%" - "32px");
`;

const Input = styled.input`
  width: 100%;
`;

const Textarea = styled.textarea`
  width: 100%;
`;

const Url = styled.p`
  margin: 0 16px;
  world-wrap: break-word;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-flow: column;
  margin: 0 4px;
`;

const MenuButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 30px;
  margin: 0 4px;
  font-weight: bold;
  border-radius: 4px;
  background-color: #ffffff;
  width: 100%;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: #ff0033;
    color: #ffffff;
  }
`;

const MessageContainer = styled.div`
  width: 280px;
  height: 40px;
  border-radius: 5px;
  background-color: #ffffff;
  margin: 8px;
  z-index: 1;
`;

const IconImage = styled(Image)`
  width: 30px;
  height: 30px;
  float: left;
  margin: 0;
  margin-left: 8px;
  border-radius: 50%;
  border: solid 0px #000000;
`;

const Message = styled.div`
  width: 220px;
  height: 20px;
  font-size: 14px;
  font-weight: bold;
  color: #444444;
  margin: 0;
  margin-top: 4px;
  margin-left: 16px;
  float: left;
`;

export default Popup;
