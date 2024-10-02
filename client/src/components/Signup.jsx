
function Signup() {

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    console.log("Signing up with:", username, password);
  }

  return (
    <form onSubmit={handleSubmit}>
    <label htmlFor="username">Username</label>
    <input type="text" id="username" name="username" />
    <label htmlFor="email">Email</label>
    <input type="email" id="email" name="email" />
    <label htmlFor="password">Password</label>
    <input type="password" id="password" name="password" />
    <label htmlFor="password">Confirm Password</label>
    <input type="password" id="confirm-password" name="confirm-password" />
    <button type="submit">Sign Up</button>
</form>
  );
}

export default Signup;