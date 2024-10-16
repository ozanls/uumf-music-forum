function UserCard(props) {
  const { user } = props;

  return (
    <div className="user__card">
      <span className="user__card__name">@{user.username}</span>
      <span className="user__card__role">{user.role}</span>

      <span className="user__card__date">
        <time>Joined {new Date(user.createdAt).toLocaleDateString()}</time>
      </span>
      <span className="user__card__bio">{user.bio}</span>
    </div>
  );
}

export default UserCard;
