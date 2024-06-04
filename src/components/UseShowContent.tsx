// useShowContent.ts
import { useEffect, useState } from "react";

const UseShowContent = (count: number) => {
  const [showContent, setShowContent] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setShowContent(true);
    }, count); // 1초 후에 콘텐츠를 보여주기
  }, []);

  return showContent;
};

export default UseShowContent;
