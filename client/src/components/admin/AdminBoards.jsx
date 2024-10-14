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
  } = props;

  return (
    <>
      <h2>Boards</h2>
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
                    <button onClick={() => saveEditedBoard(board.id)}>
                      Save
                    </button>
                    <button onClick={() => setEditingBoard(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <a href={`/b/${board.name}`}>
                      <button>Visit /{board.name}/</button>
                    </a>
                    <button onClick={() => setEditingBoard(board.id)}>
                      Edit
                    </button>
                    <button onClick={() => deleteBoard(board.id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    </>
  );
}

export default AdminBoards;
