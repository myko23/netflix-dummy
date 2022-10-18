import jwt from "jsonwebtoken";

export const verifyToken = async (token) => {
	const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

	return decodedToken;
};
