import Head from "next/head";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Data,
  findIndex,
  findData,
  getData,
  setData,
  sendMessage,
  removeDatas,
  Store,
} from "lib/chrome_util";
import styled from "styled-components";
import { useForm } from "react-hook-form";

type Step = "normal" | "stocked" | "copied" | "removed";

type FormData = {
  title: string;
  comment: string;
};

const Popup: React.FC = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<Step>("normal");
  const [store, setStore] = useState<Store>({});
  const message = useMemo(() => {
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
  }, [step]);

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const tab = tabs[0];
      setValue("title", tab.title || "不明なページ");
      setUrl(tab.url || "unknown");
      getData((items) => {
        setStore(items);
        const datas = (items.data || []) as Data[];
        const data = findData(datas, tab.url || "unknown");
        if (data) {
          setValue("comment", data.comment);
        }
      });
    });
  }, []);

  const onClickSaveButton = (data: FormData) => {
    const { title, comment } = data;
    const datas = (store.data || []) as Data[];
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
    setData({ data: datas }, () => {
      setStep("stocked");
      newData = newData as Data;
      sendMessage({
        md: `[${newData.title}](${newData.url})${newData.comment}\n`,
        closeWindow: false,
      });
    });
  };

  const onClickCopyButton = () => {
    const datas = (store.data || []) as Data[];
    if (datas.length === 0) {
      return;
    }
    setStep("copied");
    const md = datas.reduce((result, item) => {
      if (item.comment !== "") {
        return `${result}- [${item.title}](${item.url})\n${item.comment}\n`;
      } else {
        return `${result}- [${item.title}](${item.url})\n`;
      }
    }, "");
    sendMessage({ md: md });
    removeDatas();
  };

  const onClickRemoveButton = () => {
    setStep("removed");
    removeDatas();
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
        <form>
          <Box>
            <Title>TITLE</Title>
            <BoxContent>
              <Input type="text" name="title" ref={register} />
            </BoxContent>
          </Box>
          <Box>
            <Title>COMMENT</Title>
            <BoxContent>
              <Textarea name="comment" rows={4} ref={register} />
            </BoxContent>
          </Box>
          <Box>
            <Title>URL</Title>
            <BoxContent>
              <Url>{url}</Url>
            </BoxContent>
          </Box>
        </form>
        <Divider />
        <ButtonContainer>
          <MenuButton onClick={handleSubmit(onClickSaveButton)}>
            読んだ！
          </MenuButton>
          <MenuButton onClick={onClickCopyButton}>まとめる！</MenuButton>
          <MenuButton onClick={onClickRemoveButton}>削除する！</MenuButton>
        </ButtonContainer>
        {step !== "normal" ? (
          <MessageContainer>
            <IconImage />
            <Message>{message}</Message>
          </MessageContainer>
        ) : null}
      </Container>
    </>
  );
};

const Container = styled.div`
  margin: 0;
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
  width: calc(100% - 16px);
`;

const Title = styled.span`
  font-weight: bold;
  font-size: 14px;
`;

const BoxContent = styled.div`
  margin: 8px 16px;
  margin-bottom: 0px;
  width: calc(100% - 32px);
`;

const Input = styled.input`
  width: 100%;
`;

const Textarea = styled.textarea`
  width: 100%;
`;

const Url = styled.p`
  word-break: break-all;
  width: 100%;
`;

const Divider = styled.hr`
  margin: 0 4px;
  align-self: stretch;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-flow: column;
  margin: 0 8px;
  width: calc(100% - 16px);
`;

const MenuButton = styled.a`
  display: inline-flex;
  margin: 0;
  align-items: center;
  line-height: 30px;
  padding: 2px 8px;
  font-weight: bold;
  border-radius: 4px;
  background-color: #ffffff;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: #ff0033;
    color: #ffffff;
  }
`;

const MessageContainer = styled.div`
  width: calc(100% - 16px);
  height: 40px;
  border-radius: 5px;
  background-color: #ffffff;
  margin: 8px;
  margin-top: 16px;
  z-index: 1;
  display: flex;
`;

const IconImage = styled.div`
  width: 30px;
  height: 30px;
  background-image: url("./icon.png");
  background-size: cover;
  float: left;
  margin: 0;
  margin-left: 8px;
  border-radius: 50%;
  border: solid 0px #000000;
`;

const Message = styled.div`
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
