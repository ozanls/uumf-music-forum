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
    <section className="admin__boards">
      <h2>Boards</h2>

      {/* Boards Table */}
      <table>
        {/* Table Headers */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {/* Create Board Form */}
          <tr>
            {/* Name Input */}
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

            {/* Description Input */}
            <td>
              <input
                type="text"
                name="description"
                id="description"
                placeholder="(e.g. Rap & Hip-Hop)"
                value={boardFormData.description}
                onChange={handleBoardChange}
              />
            </td>

            {/* Submit Button */}
            <td>
              <button
                className="basic-button"
                type="submit"
                onClick={createBoard}
              >
                Create Board
              </button>
            </td>
          </tr>
          {/* Map through boards and display each board */}
          {boards.map((board) => (
            <tr key={board.id}>
              <td>
                {/* If editingBoard is the current board, display a name input field */}
                {editingBoard === board.id ? (
                  <input
                    type="text"
                    name="name"
                    value={board.name}
                    onChange={(e) => handleEditBoardChange(e, board.id)}
                  />
                ) : (
                  // If editingBoard is not the current board, display the board name
                  board.name
                )}
              </td>

              {/* If editingBoard is the current board, display a description input field */}
              <td>
                {editingBoard === board.id ? (
                  <input
                    type="text"
                    name="description"
                    value={board.description}
                    onChange={(e) => handleEditBoardChange(e, board.id)}
                  />
                ) : (
                  // If editingBoard is not the current board, display the board description
                  board.description
                )}
              </td>

              {/* If editingBoard is the current board, display save and cancel buttons */}
              <td>
                {editingBoard === board.id ? (
                  <>
                    <button
                      className="basic-button"
                      onClick={() => saveEditedBoard(board.id)}
                    >
                      Save
                    </button>

                    <button
                      className="basic-button"
                      onClick={() => setEditingBoard(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  // If editingBoard is not the current board, display edit and delete buttons
                  <>
                    {/* If boardToDelete is the current board, display delete confirmation */}
                    {boardToDelete === board.id ? (
                      <>
                        <span>Are you sure?</span>
                        <DeleteButton
                          text="Confirm Delete"
                          handleAction={() => deleteBoard(board.id)}
                        />
                        <button
                          className="basic-button"
                          onClick={cancelBoardDelete}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      // If boardToDelete is not the current board, display edit and delete buttons
                      <>
                        <a href={`/b/${board.name}`}>
                          <button className="basic-button">
                            Visit /{board.name}/
                          </button>
                        </a>
                        <button
                          className="basic-button"
                          onClick={() => setEditingBoard(board.id)}
                        >
                          Edit
                        </button>
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
    </section>
  );
}

export default AdminBoards;
