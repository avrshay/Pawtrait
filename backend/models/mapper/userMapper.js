// The frontend expects the primary key as "userId"
function toUserDTO(user) {
  if (!user) return user;
  const { id, ...rest } = user.toJSON();
  return { userId: id, ...rest };
}

module.exports = { toUserDTO };