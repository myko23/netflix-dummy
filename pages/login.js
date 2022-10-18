import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { magic } from "../lib/magic-client";
import styles from "../styles/Login.module.css";

const Login = () => {
	const [email, setEmail] = useState("");
	const [userMsg, setUserMsg] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	useEffect(() => {
		const handleComplete = () => {
			setIsLoading(false);
		};

		router.events.on("routeChangeComplete", handleComplete);
		router.events.on("routeChangeError", handleComplete);

		return () => {
			router.events.off("routeChangeComplete", handleComplete);
			router.events.off("routeChangeError", handleComplete);
		};
	}, [router]);

	const handleLoginWithEmail = async (e) => {
		e.preventDefault;

		setEmail("");
		if (email) {
			try {
				setUserMsg("");
				setIsLoading(true);
				const didToken = await magic.auth.loginWithMagicLink({
					email: email,
				});

				if (didToken) {
					const response = await fetch("/api/login", {
						method: "POST",
						headers: {
							Authorization: `Bearer ${didToken}`,
							"Content-Type": "application/json",
						},
					});
					const loggedInResponse = await response.json();

					if (loggedInResponse.done) {
						router.push("/");
					} else {
						setIsLoading(false);
						setUserMsg("Something went wrong");
					}

					router.push("/");
				}
			} catch (error) {
				setIsLoading(false);
				// Handle errors if required!
				console.error("Something went wrong", error);
			}
		} else {
			setUserMsg("Enter Valid Email Address ");
		}
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>Netflix SignIn</title>
			</Head>
			<header className={styles.header}>
				<div className={styles.headerWrapper}>
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
				</div>
			</header>
			<main className={styles.main}>
				<div className={styles.mainWrapper}>
					<h1 className={styles.signinHeader}>Sign In</h1>
					<input
						type="text"
						placeholder="Email address"
						className={styles.emailInput}
						onChange={(e) => {
							setEmail(e.target.value);
						}}
						value={email}
					/>
					<p className={styles.userMsg}>{userMsg}</p>
					<button
						className={styles.loginBtn}
						onClick={handleLoginWithEmail}
					>
						{isLoading ? "Loading..." : "Sign In"}
					</button>
				</div>
			</main>
		</div>
	);
};

export default Login;
