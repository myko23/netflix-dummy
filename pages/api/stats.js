import jwt from "jsonwebtoken";
import { findVideoIdByUser, insertStats, updateStats } from "../../lib/hasura";

const stats = async (req, res) => {
	const { favourited, watched = true } = req.body;
	const { videoId } = req.query;

	const token = req.cookies?.token;

	if (!videoId) res.status(400).send("Video id does not exist");

	if (!token)
		return res
			.status(403)
			.send({ msg: "You have no access to the content" });

	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

		const userId = decodedToken.issuer;

		const doesStatsExist = await findVideoIdByUser(token, userId, videoId);

		if (req.method === "GET") {
			if (doesStatsExist?.length > 0) {
				res.send({ doesStatsExist });
			} else {
				res.send("Video ID has not been created");
			}
		} else if (req.method === "POST") {
			if (doesStatsExist?.length > 0) {
				const response = await updateStats(token, {
					favourited,
					watched,
					userId,
					videoId,
				});
				res.send({ response });
			} else {
				const response = await insertStats(token, {
					favourited,
					watched,
					userId,
					videoId,
				});
				res.send({ response });
			}
		} else return res.status(400).send("Invalid Request");
	} catch (error) {
		res.send("Error: ", error);
	}
};
export default stats;
