import { useEffect, useState } from "react";

const useImagesLoaded = (urls: string[]) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!urls || urls.length === 0) {
      setLoaded(true);
      return;
    }

    let isMounted = true;
    let completed = 0;

    setLoaded(false);
    setLoadedCount(0);

    urls.forEach((url) => {
      const img = new Image();
      img.src = url;

      const handleComplete = () => {
        completed += 1;
        if (!isMounted) return;
        setLoadedCount(completed);
        if (completed === urls.length) {
          setLoaded(true);
        }
      };

      img.onload = handleComplete;
      img.onerror = handleComplete; // count failed images too
    });

    return () => {
      isMounted = false;
    };
  }, [urls]);

  const progress = urls.length > 0 ? loadedCount / urls.length : 1;

  return { loaded, loading: !loaded, progress };
};

export default useImagesLoaded;
