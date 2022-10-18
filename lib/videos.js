import videoTestData from "../data/video.json";
import { getMyListVideos, getWatchedVideos } from "./hasura";

export const fetchVideos = async (url) => {
	const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
	const BASE_URL = "youtube.googleapis.com/youtube/v3";

	const response = await fetch(
		`https://${BASE_URL}/${url}&key=${YOUTUBE_API_KEY}`
	);
	return await response.json();
};

export const getCommonVideos = async (url) => {
	const isDev = process.env.DEVELOPMENT;
	try {
		const data = isDev === "TRUE" ? videoTestData : await fetchVideos(url);
		if (data?.error) {
			console.error("YOUTUBE API ERROR: ", data.error);
			return [];
		}

		return data.items.map((item) => {
			const id = item.id?.videoId || item.id;
			const snippet = item.snippet;
			return {
				title: snippet?.title,
				imgUrl: `https://i.ytimg.com/vi/${
					item.id.videoId || item.id
				}/maxresdefault.jpg`,
				id,
				description: snippet.description,
				publishTime: snippet.publishedAt,
				channelTitle: snippet.channelTitle,
				statistics: item.statistics
					? item.statistics
					: { viewCount: 0 },
			};
		});
	} catch (error) {
		console.error("Something went wrong with ERROR ", error);
		return [];
	}
};

export const getVideos = (searchQuery) => {
	const URL = `search?part=snippet&maxResults=25&q=${searchQuery}&type=video`;

	return getCommonVideos(URL);
};

export const getPopularVideos = async () => {
	const URL =
		"videos?part=snippet%2CcontentDetails%2Cstatistics&maxResults=25&chart=mostPopular";
	return getCommonVideos(URL);
};
export const getYoutubeVideoId = (videoId) => {
	const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;

	return getCommonVideos(URL);
};

export const setDefaultVideos = (video) => {
	return video.items.map((item) => {
		return {
			title: item.snippet.title,
			imgUrl: item.snippet.thumbnails.high.url,
			id: item.id.videoId,
		};
	});
};
`1`;

export const getWatchItAgainVideos = async (userId, token) => {
	const videos = await getWatchedVideos(userId, token);

	return videos?.map((video) => {
		return {
			id: video.videoId,
			imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
		};
	});
};
export const getMyList = async (userId, token) => {
	const videos = await getMyListVideos(userId, token);

	return videos?.map((video) => {
		return {
			id: video.videoId,
			imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
		};
	});
};
