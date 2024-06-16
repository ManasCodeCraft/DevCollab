import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { message } from "../globalComponents/utilityModal";

// custom hook for making request on server
export default function useMakeRequest(url, responseActions = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusCode, setStatusCode] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const response = await axios({
          url,
          method: "POST",
          data: body,
          cancelToken: source.token,
        });
        setStatusCode(response.status);
        setData(response.data);
      } catch (err) {
        if (err.response) {
          if (response.status >= 500) {
            let text_message = response.data.message || "An Error has occurred";
            message(`Error ${response.status}`, text_message, dispatch);
          } else if (
            responseActions &&
            typeof responseActions[1] === "function"
          ) {
            responseActions[1](err.response);
          }
        }

        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      source.cancel("Component unmounted");
    };
  }, [url, method, body]);

  return { data, loading, statusCode, error };
}
