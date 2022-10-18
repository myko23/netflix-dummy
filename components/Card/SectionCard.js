import Link from "next/link";
import React from "react";
import Card from "./Card";
import styles from "./SectionCard.module.css";
import cls from "classnames";

const SectionCard = (props) => {
	const {
		title,
		videos = [],
		size = "large",
		shouldWrap = false,
		shouldScale,
	} = props;

	const renderVideos = () => {
		return videos.map((video, index) => {
			return (
				<Link key={index} href={`/video/${video.id}`}>
					<a>
						<Card
							id={index}
							imgUrl={video.imgUrl}
							size={size}
							shouldScale={shouldScale}
						/>
					</a>
				</Link>
			);
		});
	};

	return (
		<section className={styles.container}>
			<h2 className={styles.title}>{title}</h2>
			<div className={cls(styles.cardWrapper, shouldWrap && styles.wrap)}>
				{renderVideos()}
			</div>
		</section>
	);
};

export default SectionCard;
