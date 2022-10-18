import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import { magic } from "../../lib/magic-client";

const Navbar = (props) => {
	const [username, setUserName] = useState("");

	const router = useRouter();

	useEffect(() => {
		async function getUsername() {
			try {
				const { email, publicAddress } = await magic.user.getMetadata();
				const didToken = await magic.user.getIdToken();
				if (email) {
					setUserName(email);
				}
			} catch (error) {
				console.error("Something went wrong ", error);
			}
		}
		getUsername();
	});

	const [showDropdown, setShowDropdown] = useState(false);

	const handleOnClickHome = (e) => {
		e.preventDefault();
		router.push("/");
	};
	const handleOnClickMyList = (e) => {
		e.preventDefault();
		router.push("/browse/my-list");
	};

	const handleShowDropdown = (e) => {
		setShowDropdown(!showDropdown);
	};

	const handleSignOut = async (e) => {
		e.preventDefault;

		try {
			await magic.user.logout();

			router.push("/login");
		} catch (error) {
			console.error("Something went wrong", error);
			router.push("/login");
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<a href="" className={styles.logoLink}>
					<div className={styles.logoWrapper}>
						<Image
							src="/static/netflix.svg"
							alt="Netflix logo"
							width="128px"
							height="34px"
						></Image>
					</div>
				</a>

				<ul className={styles.navItems}>
					<li className={styles.navItem} onClick={handleOnClickHome}>
						Home
					</li>
					<li
						className={styles.navItem2}
						onClick={handleOnClickMyList}
					>
						My List
					</li>
				</ul>
				<nav className={styles.navContainer}>
					<div>
						<button
							className={styles.usernameBtn}
							onClick={handleShowDropdown}
						>
							<p className={styles.username}>{username}</p>
							<Image
								src="/static/expand_more.svg"
								alt="Expand dropdown"
								width="24px"
								height="24px"
								style={{ color: "white" }}
							></Image>
						</button>
						{showDropdown && (
							<div className={styles.navDropdown}>
								<div>
									<a
										onClick={handleSignOut}
										className={styles.linkName}
									>
										Sign Out
									</a>

									<div className={styles.lineWrapper}></div>
								</div>
							</div>
						)}
					</div>
				</nav>
			</div>
		</div>
	);
};

export default Navbar;
