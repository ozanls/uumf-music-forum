function AdminMenu(props) {
    const { user, setError } = props;

    return (
        <>
            {user && user.role !== 'admin' ? (
                setError('You are not authorized to view this page')
            ) : (
                <h1>Admin Menu</h1>
            )}
        </>
    );
}

export default AdminMenu;