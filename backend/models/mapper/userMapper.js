
// Converts a User DB object into a simpler object for the frontend:
// renames "id" to "userId".
function toUserDTO(user) {
  if (!user) return user;
  const { id, ...rest } = user.toJSON();
  return { userId: id, ...rest };
}

module.exports = { toUserDTO };