import { useRouter } from "next/router";
import Modal from "react-modal";
import styles from "../../styles/Video.module.css";
import { getYoutubeVideoId } from "../../lib/videos";
import cls from "classnames";
import NavBar from "../../components/Nav/Navbar";
import Like from "../../components/icons/like-icon";
import DisLike from "../../components/icons/dislike-icon";
import { useEffect, useState } from "react";

Modal.setAppElement("#__next");

export async function getStaticProps(context) {
	const videoArray = await getYoutubeVideoId(context.params.videoId);

	return {
		props: {
			video: videoArray.length > 0 ? videoArray[0] : {},
		},
		revalidate: 10,
	};
}
export async function getStaticPaths() {
	const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"];

	const paths = listOfVideos.map((videoId) => {
		return {
			params: {
				videoId,
			},
		};
	});

	return { paths, fallback: "blocking" };
}

const Video = ({ video }) => {
	const router = useRouter();

	const { videoId } = router.query;

	const [toggleLike, setToggleLike] = useState(false);
	const [toggleDislike, settoggleDislike] = useState(false);

	const {
		title,
		publishTime,
		description,
		channelTitle,
		statistics: { viewCount } = { viewCount: 0 },
	} = video;

	useEffect(() => {
		const fetchData = async () => {
			const response = await runRatingService("GET");
			const { doesStatsExist } = await response.json();

			if (doesStatsExist?.length !== 0) {
				if (doesStatsExist[0].favourited === 1) {
					setToggleLike(true);
					settoggleDislike(false);
				} else {
					setToggleLike(false);
					settoggleDislike(true);
				}
			}
		};

		fetchData();
	}, []);

	const runRatingService = async (method, favourited = 0) => {
		let settings = {
			method,
			headers: {
				"Content-Type": "application/json",
			},
		};
		if (method === "POST") {
			settings = {
				...settings,
				body: JSON.stringify({
					favourited,
				}),
			};
		}

		return await fetch(`/api/stats?videoId=${videoId}`, settings);
	};
	const handleToggleLike = async () => {
		setToggleLike(true);
		settoggleDislike(false);

		runRatingService("POST", 1);
	};

	const handleToggleDislike = async () => {
		settoggleDislike(true);
		setToggleLike(false);

		runRatingService("POST", 0);
	};

	return (
		<div className={styles.container}>
			<Modal
				isOpen={true}
				contentLabel="Watch the video"
				onRequestClose={() => router.back()}
				className={styles.modal}
				overlayClassName={styles.overlay}
			>
				<NavBar />
				<iframe
					className={styles.videoPlayer}
					id="player"
					type="text/html"
					width="100%"
					height="390"
					src={`http://www.youtube.com/embed/${router.query.videoId}?enablejsapi=1&origin=http://example.com&controls=0&rel=1&autoplay=0`}
					frameBorder="0"
				></iframe>

				<div className={styles.likeDislikeBtnWrapper}>
					<div className={styles.likeBtnWrapper}>
						<button onClick={handleToggleLike}>
							<div className={styles.btnWrapper}>
								<Like selected={toggleLike} />
							</div>
						</button>
					</div>
					<button onClick={handleToggleDislike}>
						<div className={styles.btnWrapper}>
							<DisLike selected={toggleDislike} />
						</div>
					</button>
				</div>

				<div className={styles.modalBody}>
					<div className={styles.modalBodyContent}>
						<div className={styles.col1}>
							<p className={styles.publishTime}>{publishTime}</p>
							<p className={styles.title}>{title}</p>
							<p className={styles.description}>{description}</p>
						</div>
						<div className={styles.col2}>
							<p
								className={cls(
									styles.subText,
									styles.subTextWrapper
								)}
							>
								<span className={styles.textColor}>Cast:</span>
								<span className={styles.channelTitle}>
									{channelTitle}
								</span>
							</p>
							<p
								className={cls(
									styles.subText,
									styles.subTextWrapper
								)}
							>
								<span className={styles.textColor}>
									View Count:
								</span>
								<span className={styles.channelTitle}>
									{viewCount}
								</span>
							</p>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default Video;
