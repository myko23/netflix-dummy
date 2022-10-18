import { verifyToken } from "../lib/utils";

const RedirectUser = async (context) => {
	const token = context.req ? context.req.cookies?.token : null;

	const response = await verifyToken(token);

	const userId = response?.issuer;

	return {
		userId,
		token,
	};
};

export default RedirectUser;
