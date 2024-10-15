import { useEffect } from "react";

const siteName = "UUMF";

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `${title} - ${siteName}`;
  }, [title]);
};

export default usePageTitle;
