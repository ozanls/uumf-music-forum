import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import usePageTitle from "../utilities/usePageTitle";
import axios from "axios";

function BoardTags(props) {
  const { setMessage } = props;
  const { boardName } = useParams();
  const [board, setBoard] = useState(null);
  const [tags, setTags] = useState([]);

  usePageTitle(`Top 20 Tags /${boardName}/`);

  useEffect(() => {
    const fetchBoard = async () => {
      // If boardName is not provided, return
      if (!boardName) {
        setMessage({ type: "error", message: "Board name is not defined" });
        return;
      }

      // Send a GET request to the server to get the board details
      // GET /boards/:boardName
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/boards/${boardName}`
        );

        // Update the board state
        setBoard(response.data);

        // If there is an error fetching the board, display an error message
      } catch (error) {
        console.error("Error fetching board:", error);
        setMessage({ type: "error", message: "Board Not Found" });
      }
    };

    fetchBoard();
  }, [boardName]);

  useEffect(() => {
    const fetchTags = async () => {
      // If board is not loaded, return
      if (!board) {
        return;
      }

      // Send a GET request to the server to get the active tags for the board
      // GET /boards/:boardId/tags/active
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/boards/${board.id}/tags/active`
        );

        // Update the tags state
        setTags(response.data);

        // If there is an error fetching tags, display an error message
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [board]);

  return (
    <main className="board-tags">
      {/* If the board is loaded, display the board details */}
      {board ? (
        <>
          <section className="page__header">
            <h2>/{boardName}/</h2>
            <h1>Top 20 Tags</h1>
            <span>Sorted by popularity in the past 7 days.</span>
          </section>

          {/* If tags are loaded, display the tags */}
          {tags ? (
            <section className="page__content">
              <table>
                <tbody>
                  {tags.map((tag, index) => (
                    <tr key={tag.id}>
                      <td>
                        <h3>#{index + 1}</h3>
                      </td>
                      <td
                        className="board-tags__name"
                        style={{ backgroundColor: tag.hexCode }}
                        onClick={() =>
                          (window.location.href = `/b/${boardName}/tag/${tag.name}`)
                        }
                      >
                        <h2>#{tag.name}</h2>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : (
            // If there are no tags, display a message
            <section className="page__content">
              <button className="basic-button-2" onClick={() => navigate(-1)}>
                Go Back
              </button>
            </section>
          )}
        </>
      ) : (
        // If the board is not loaded, display a loading message
        <section className="page__content">
          <button className="basic-button-2" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </section>
      )}
    </main>
  );
}

export default BoardTags;
