import Head from "next/head";
import React from "react";
import SectionCard from "../../components/Card/SectionCard";
import Navbar from "../../components/Nav/Navbar";
import { getMyList } from "../../lib/videos";
import styles from "../../styles/MyList.module.css";
import RedirectUser from "../../utils/RedirectUser";

export async function getServerSideProps(context) {
	const { userId, token } = await RedirectUser(context);

	if (!userId) {
		return {
			props: {},
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	const myListVideos = await getMyList(userId, token);

	return {
		props: {
			myListVideos,
		},
	};
}

const MyList = ({ myListVideos }) => {
	return (
		<div>
			<Head>
				<title>My List</title>
			</Head>
			<main className={styles.main}>
				<Navbar />
				<div className={styles.sectionWrapper}>
					<SectionCard
						title="My List"
						videos={myListVideos}
						size="small"
						shouldWrap
						shouldScale={false}
					/>
				</div>
			</main>
		</div>
	);
};

export default MyList;
