import BasicButton from "../buttons/BasicButton";
import DeleteButton from "../buttons/DeleteButton";

function AdminBoards(props) {
  const {
    boards,
    editingBoard,
    handleEditBoardChange,
    saveEditedBoard,
    setEditingBoard,
    deleteBoard,
    createBoard,
    boardFormData,
    handleBoardChange,
    boardToDelete,
    handleBoardDelete,
    cancelBoardDelete,
  } = props;

  return (
    <>
      <h2>Boards</h2>
      <form onSubmit={createBoard}>
        <table>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="(e.g. rhh)"
                  value={boardFormData.name}
                  onChange={handleBoardChange}
                />
              </td>
              <td>
                <input
                  type="textarea"
                  name="description"
                  id="description"
                  placeholder="(e.g. Rap & Hip-Hop)"
                  value={boardFormData.description}
                  onChange={handleBoardChange}
                />
              </td>
              <td>
                <button type="submit">Create Board</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {boards.map((board) => (
            <tr key={board.id}>
              <td>
                {editingBoard === board.id ? (
                  <input
                    type="text"
                    name="name"
                    value={board.name}
                    onChange={(e) => handleEditBoardChange(e, board.id)}
                  />
                ) : (
                  board.name
                )}
              </td>
              <td>
                {editingBoard === board.id ? (
                  <input
                    type="text"
                    name="description"
                    value={board.description}
                    onChange={(e) => handleEditBoardChange(e, board.id)}
                  />
                ) : (
                  board.description
                )}
              </td>
              <td>
                {editingBoard === board.id ? (
                  <>
                    <BasicButton
                      text="Save"
                      handleAction={() => saveEditedBoard(board.id)}
                    />

                    <BasicButton
                      text="Cancel"
                      handleAction={() => setEditingBoard(null)}
                    />
                  </>
                ) : (
                  <>
                    {boardToDelete === board.id ? (
                      <>
                        <span>Are you sure?</span>
                        <DeleteButton
                          text="Confirm Delete"
                          handleAction={() => deleteBoard(board.id)}
                        />
                        <BasicButton
                          text="Cancel"
                          handleAction={cancelBoardDelete}
                        />
                      </>
                    ) : (
                      <>
                        <a href={`/b/${board.name}`}>
                          <button>Visit /{board.name}/</button>
                        </a>
                        <BasicButton
                          text="Edit"
                          handleAction={() => setEditingBoard(board.id)}
                        />
                        <DeleteButton
                          text="Delete"
                          handleAction={() => handleBoardDelete(board.id)}
                        />
                      </>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default AdminBoards;
